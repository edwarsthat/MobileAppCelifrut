import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Button, TextInput, Alert, Modal, Text, TouchableOpacity, FlatList } from "react-native";
import { validarActualizarPallet, validarEliminar, validarMoverItem, validarResta, validarSumarDato } from "../controller/valiadations";
import { itemType } from "../types/types";
import ModalModificarItem from "./ModalModificarItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { useAppContext } from "../../../../hooks/useAppContext";
import { contenedoresType } from "../../../../../types/contenedoresType";

type propsType = {
  agregarItem: (item: itemType) => void;
  eliminarItem: () => void;
  restarItem: (item: any) => void;
  moverItem: (item: any) => void;
  modificarItems: (e: any) => void;
  contenedores: contenedoresType[];
};

export default function Footer(props: propsType): React.JSX.Element {
  const { anchoDevice } = useAppContext();
  const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
  const pallet = useListaDeEmpaqueStore(state => state.pallet);
  const loteActual = useListaDeEmpaqueStore(state => state.loteSeleccionado);
  const seleccion = useListaDeEmpaqueStore(state => state.seleccion);

  const [contenedorID, setContenedorID] = useState<string>("");
  const [entradaModalPallet, setEntradaModalPallet] = useState<string>('');
  const [entradaModalCajas, setEntradaModalCajas] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cliente, setCliente] = useState<string>('Contenedores');
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [showCajasInput, setShowcajasInput] = useState<boolean>(true);
  const [openModalEditar, setOpenModalEditar] = useState<boolean>(false);

  const [cajas, setCajas] = useState<number>(0);

  useEffect(() => {
    setIsTablet(anchoDevice >= 721);
  }, [anchoDevice]);
  const clickActualizar = async () => {
    try {
      if (!contenedor) { throw new Error("contenedor undefinide"); }
      if (!loteActual) { throw new Error("Seleccione un lote"); }

      const value = await AsyncStorage.getItem(`${contenedor?._id}:${pallet}`);
      let cajas_input;

      if (value) {
        cajas_input = cajas + Number(value);
      } else {
        cajas_input = cajas;
      }

      const cajasActual = validarActualizarPallet(cajas_input, loteActual, pallet, contenedor);

      const item = {
        lote: loteActual?._id,
        cajas: cajasActual,
        tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
        calibre: String(contenedor?.pallets[pallet].settings.calibre),
        calidad: String(contenedor?.pallets[pallet].settings.calidad),
        tipoFruta: loteActual?.tipoFruta._id || "",
        fecha: new Date(),
      };
      props.agregarItem(item);
      setCajas(0);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };
  const clickSumar = () => {
    try {
      if (!contenedor) { throw new Error("contenedor undefinide"); }
      if (!loteActual) { throw new Error("Seleccione un lote"); }

      validarSumarDato(cajas, loteActual, pallet, contenedor);
      const item: itemType = {
        lote: loteActual._id,
        cajas: cajas,
        tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
        calibre: String(contenedor?.pallets[pallet].settings.calibre),
        calidad: String(contenedor?.pallets[pallet].settings.calidad),
        fecha: new Date(),
        tipoFruta: loteActual.tipoFruta._id,
      };
      console.log("item", item);
      props.agregarItem(item);
      setCajas(0);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };
  const clickEliminar = () => {
    try {
      validarEliminar(cajas, seleccion);
      Alert.alert('Eliminar items', '¿Desea eliminar los items?', [
        {
          text: 'Cancelar',
          onPress: () => console.log("cancelar"),
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: () => {
            props.eliminarItem();
          },
          style: 'default',
        },
      ]);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };
  const clickRestar = () => {
    try {
      if (!contenedor) { throw new Error("Seleccione contenedor"); }
      validarResta(contenedor, cajas, seleccion, pallet);
      props.restarItem(cajas);
      setCajas(0);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };
  const ClickOpenMoverCajas = () => {
    if (seleccion.length === 0) { return Alert.alert('Seleccione un item que desee mover a otro pallet'); }
    else if (seleccion.length > 1) { setShowcajasInput(false); }
    // else { setShowcajasInput(true); }
    setOpenModal(true);
  };
  const ClickOpenEditar = () => {
    if (seleccion.length <= 0) {
      return Alert.alert("Seleccione los items que desea modificar");
    }
    setOpenModalEditar(true);
  };
  const clickMover = () => {
    try {
      if (!contenedor) { throw new Error("contenedor undefinide"); }
      const contenedor2 = props.contenedores.find(c => c._id === contenedorID) || "";
      validarMoverItem(
        Number(entradaModalCajas),
        seleccion,
        pallet,
        contenedor._id,
        contenedorID,
        entradaModalPallet,
        contenedor,
        contenedor2
      );

      const item = {
        contenedor: contenedorID,
        pallet: Number(entradaModalPallet) - 1,
        numeroCajas: Number(entradaModalCajas),
      };
      props.moverItem(item);
      setCajas(0);
      setEntradaModalCajas('');
      setEntradaModalPallet('');
      setOpenModal(false);
      return 0;
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.baseContainer, isTablet ? styles.containerTablet : styles.containerMobile]}>
      <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
        <Button title="Actualizar" onPress={clickActualizar} />
      </View>
      <View style={styles.viewTextInput}>
        <TextInput
          keyboardType="numeric"
          style={[styles.textInputBase, isTablet ? styles.textInputTablet : styles.textInputMobile]}
          value={String(cajas || '')}
          onChange={e => setCajas(Number(e.nativeEvent.text))} />
      </View>
      <View>
        <Button title="Sumar" onPress={clickSumar} />
      </View>
      <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
        <Button title="Restar" onPress={clickRestar} />
      </View>
      <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
        <Button title="Mover" onPress={ClickOpenMoverCajas} />
      </View>
      <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
        <Button title="Editar" onPress={ClickOpenEditar} />
      </View>
      <View>
        <Button title="Eliminar" onPress={clickEliminar} />
      </View>

      {/* Modal mover*/}
      <Modal transparent={true} visible={openModal} animationType="fade">
        <View style={styles.centerModal}>
          <View style={showCajasInput ? styles.viewModalItem : styles.viewModalItems}>
            <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Seleccione el contenedor al que desea mover
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (props.contenedores.length !== 0) {
                  setModalVisible(true);
                }
              }}
              style={styles.buttonContenedores}>
              <Text>{cliente}</Text>
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Ingrese el numero del pallet o estiba que desea mover el item
              </Text>
            </View>
            <View style={styles.modalInputView}>
              <TextInput
                onChange={e => setEntradaModalPallet(e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.modalInput} />
            </View>
            {showCajasInput && <View style={styles.modalHeader}>
              <Text style={styles.textModalHeader}>
                Ingrese el numero de items que desea mover
              </Text>
            </View>}
            {showCajasInput && <View style={styles.modalInputView}>
              <TextInput
                onChange={e => setEntradaModalCajas(e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.modalInput} />
            </View>}
            <View style={styles.viewButtonsModal}>
              <Button title="Mover" onPress={clickMover} />
              <Button title="Cancelar" onPress={() => setOpenModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.centerModal}>
          <View style={showCajasInput ? styles.viewModalItem : styles.viewModalItems}>
            <FlatList
              data={props.contenedores}
              style={styles.pressableStyle}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCliente(
                      item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE,
                    );
                    setContenedorID(item._id);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.textList}>
                    {item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id.toString()}
            />
          </View>
        </View>
      </Modal>

      <ModalModificarItem
        modificarItems={props.modificarItems}
        setOpenModalEditar={setOpenModalEditar}
        openModalEditar={openModalEditar} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // Estilos base
  baseContainer: {
    backgroundColor: '#8B9E39',
    alignItems: 'center',
    paddingVertical: 20,
  },

  // Estilos para tablet
  containerTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },

  // Estilos para móvil
  containerMobile: {
    flexDirection: 'column',
  },

  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },

  hidden: {
    display: 'none',
  },

  viewTextInput: {
    marginVertical: 10,
  },

  textInputBase: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
  },

  textInputTablet: {
    width: 150,
    height: 50,
  },

  textInputMobile: {
    width: 120,
    height: 40,
  },

  centerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },

  viewModalItem: {
    width: 500,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewModalItems: {
    width: 500,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },

  textModalHeader: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },

  modalInputView: {
    marginVertical: 10,
  },

  modalInput: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
    height: 40,
    paddingHorizontal: 10,
  },

  viewButtonsModal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
  },

  buttonContenedores: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
  },

  textList: {
    color: 'black',
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
});

