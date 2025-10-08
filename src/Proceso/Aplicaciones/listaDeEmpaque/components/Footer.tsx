import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Button, TextInput, Alert, Modal, Text, TouchableOpacity, FlatList } from "react-native";
import { validarActualizarPallet, validarEliminar, validarMoverItem, validarResta, validarSumarDato } from "../controller/valiadations";
import { itemType } from "../types/types";
import ModalModificarItem from "./ModalModificarItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { useAppContext } from "../../../../hooks/useAppContext";
import { contenedoresType } from "../../../../../types/contenedores/contenedoresType";
import { palletsType } from "../../../../../types/contenedores/palletsType";
import { itemPalletType } from "../../../../../types/contenedores/itemsPallet";
// import useTipoFrutaStore from "../../../../stores/useTipoFrutaStore";

type propsType = {
  agregarItem: (item: itemType) => void;
  eliminarItem: () => void;
  restarItem: (item: any) => void;
  moverItem: (item: any) => void;
  modificarItems: (e: any) => void;
  contenedores: contenedoresType[];
  pallets: palletsType[];
  palletsItems: itemPalletType[];
};

export default function Footer(props: propsType): React.JSX.Element {
  const { anchoDevice } = useAppContext();
  const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
  const pallet = useListaDeEmpaqueStore(state => state.pallet);
  const loteActual = useListaDeEmpaqueStore(state => state.loteSeleccionado);
  const seleccion = useListaDeEmpaqueStore(state => state.seleccion);
  // const tipoFruta = useTipoFrutaStore(state => state.tiposFruta);

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
      const palletInfo = props.pallets.find(p => p.numeroPallet === pallet);
      if (!palletInfo) {
        return Alert.alert("Pallet no definido");
      }

      const value = await AsyncStorage.getItem(`${contenedor?._id}:${pallet}`);
      let cajas_input;

      if (value) {
        cajas_input = cajas + Number(value);
      } else {
        cajas_input = cajas;
      }

      const cajasActual = validarActualizarPallet(cajas_input, loteActual, palletInfo, props.palletsItems.filter(item => item.pallet === palletInfo._id));

      const item = {
        lote: loteActual?._id,
        cajas: cajasActual,
        tipoCaja: palletInfo.tipoCaja,
        calibre: palletInfo.calibre,
        calidad: String(palletInfo.calidad._id),
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
      const palletInfo = props.pallets.find(p => p.numeroPallet === pallet);
      if (!palletInfo) {
        return Alert.alert("Pallet no definido");
      }
      validarSumarDato(cajas, loteActual, pallet, palletInfo);

      const item: itemType = {
        lote: loteActual._id,
        cajas: cajas,
        tipoCaja: palletInfo.tipoCaja,
        calibre: String(palletInfo.calibre),
        calidad: String(palletInfo.calidad._id),
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
      <View style={[styles.actionsBar, isTablet ? styles.actionsBarTablet : styles.actionsBarMobile]}>
        <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
          <Button title="Actualizar" onPress={clickActualizar} accessibilityLabel="Actualizar pallet con cajas acumuladas" />
        </View>
        <View style={styles.viewTextInput}>
          <TextInput
            keyboardType="numeric"
            style={[styles.textInputBase, isTablet ? styles.textInputTablet : styles.textInputMobile]}
            value={String(cajas || '')}
            placeholder="Cantidad"
            placeholderTextColor="#94A3B8"
            accessibilityLabel="Ingresar cantidad de cajas"
            onChange={e => setCajas(Number(e.nativeEvent.text))} />
        </View>
        <View>
          <Button title="Sumar" onPress={clickSumar} accessibilityLabel="Sumar cajas al pallet" />
        </View>
        <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
          <Button title="Restar" onPress={clickRestar} accessibilityLabel="Restar cajas del item seleccionado" />
        </View>
        <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
          <Button title="Mover" onPress={ClickOpenMoverCajas} accessibilityLabel="Mover items a otro pallet" />
        </View>
        <View style={[styles.buttonContainer, !isTablet && styles.hidden]}>
          <Button title="Editar" onPress={ClickOpenEditar} accessibilityLabel="Editar items seleccionados" />
        </View>
        <View>
          <Button title="Eliminar" onPress={clickEliminar} accessibilityLabel="Eliminar items seleccionados" />
        </View>
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
              <Button title="Mover" onPress={clickMover} accessibilityLabel="Confirmar mover items" />
              <Button title="Cancelar" onPress={() => setOpenModal(false)} accessibilityLabel="Cerrar modal de mover" />
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

      {/* <ModalModificarItem
        modificarItems={props.modificarItems}
        setOpenModalEditar={setOpenModalEditar}
        openModalEditar={openModalEditar} /> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // Estilos base
  baseContainer: {
    backgroundColor: 'transparent',
    alignItems: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '100%',
  },

  // Contenedor visual de acciones (card)
  actionsBar: {
    backgroundColor: '#8B9E39', // verde como el fondo anterior
    borderRadius: 16,
    padding: 12,
    // sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
  },
  actionsBarTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionsBarMobile: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // Estilos para tablet
  containerTablet: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  // Estilos para móvil
  containerMobile: {
    alignItems: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  buttonContainer: {
    marginVertical: 6,
    marginHorizontal: 8,
    minWidth: 120,
  },

  hidden: {
    display: 'none',
  },

  viewTextInput: {
    marginVertical: 6,
    marginHorizontal: 8,
  },

  textInputBase: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
    height: 48,
    fontSize: 16,
  },

  textInputTablet: {
    width: 180,
    height: 48,
  },

  textInputMobile: {
    width: 160,
    height: 44,
  },

  centerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  viewModalItem: {
    width: '90%',
    maxWidth: 560,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewModalItems: {
    width: '90%',
    maxWidth: 560,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },

  textModalHeader: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#334155',
  },

  modalInputView: {
    marginVertical: 10,
    width: '100%',
  },

  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    height: 44,
    paddingHorizontal: 12,
  },

  viewButtonsModal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 24,
  },

  buttonContenedores: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    maxHeight: 420,
  },

  textList: {
    color: '#0F172A',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});

