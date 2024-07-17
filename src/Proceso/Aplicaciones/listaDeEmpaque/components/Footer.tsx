/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Button, TextInput, Alert, Modal, Text, TouchableOpacity, FlatList } from "react-native";
import { validarActualizarPallet, validarEliminar, validarMoverItem, validarResta, validarSumarDato } from "../controller/valiadations";
import { contenedorSeleccionadoContext, contenedoresContext, itemSeleccionContext, loteSeleccionadoContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { contenedoresType } from "../../../../../types/contenedoresType";
import { itemType } from "../types/types";
import { deviceWidth } from "../../../../../App";
import ModalModificarItem from "./ModalModificarItem";

type propsType = {
  agregarItem: (item: itemType) => void;
  eliminarItem: () => void;
  restarItem: (item: any) => void;
  moverItem: (item: any) => void;
  eliminarItemCajasSinPallet: () => void;
  modificarItems: (e:any) => void;
};

export default function Footer(props: propsType): React.JSX.Element {
  const anchoDevice = useContext(deviceWidth);
  const loteActual = useContext(loteSeleccionadoContext);
  const seleccion = useContext(itemSeleccionContext);
  const pallet = useContext(palletSeleccionadoContext);
  const numeroContenedor = useContext(contenedorSeleccionadoContext);
  const contenedores = useContext(contenedoresContext);
  const contenedor: contenedoresType | undefined = useContext(contenedoresContext,).find(item => item.numeroContenedor === numeroContenedor);

  const [contenedorID, setContenedorID] = useState<number>(-1);
  const [entradaModalPallet, setEntradaModalPallet] = useState<string>('');
  const [entradaModalCajas, setEntradaModalCajas] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cliente, setCliente] = useState<string>('Sin Pallet');
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [showCajasInput, setShowcajasInput] = useState<boolean>(true);
  const [openModalEditar, setOpenModalEditar] = useState<boolean>(false);

  const [cajas, setCajas] = useState<number>(0);

  useEffect(() => {
    setIsTablet(anchoDevice >= 721);
  }, [anchoDevice]);
  const clickActualizar = () => {
    try {
      if (!contenedor) { throw new Error("contenedor undefinide"); }
      const cajasActual = validarActualizarPallet(cajas, loteActual, pallet, contenedor);

      const item = {
        lote: loteActual._id,
        cajas: cajasActual,
        tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
        calibre: String(contenedor?.pallets[pallet].settings.calibre),
        calidad: String(contenedor?.pallets[pallet].settings.calidad),
        tipoFruta: loteActual.tipoFruta,
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
      validarSumarDato(cajas, loteActual, pallet, contenedor);
      const item: itemType = {
        lote: loteActual._id,
        cajas: cajas,
        tipoCaja: contenedor?.pallets[pallet].settings.tipoCaja,
        calibre: String(contenedor?.pallets[pallet].settings.calibre),
        calidad: String(contenedor?.pallets[pallet].settings.calidad),
        fecha: new Date(),
        tipoFruta: loteActual.tipoFruta,
      };
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
      validarEliminar(cajas, loteActual, seleccion);
      Alert.alert('Eliminar items', '¿Desea eliminar los items?', [
        {
          text: 'Cancelar',
          onPress: () => console.log("cancelar"),
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: () => {
            if (pallet === -1) {
              props.eliminarItemCajasSinPallet();
            } else {
              props.eliminarItem();
            }
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
      if (!contenedor) { throw new Error("contenedor undefinide"); }
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
    if(seleccion.length <= 0){
      return Alert.alert("Seleccione los items que desea modificar");
    }
    setOpenModalEditar(true);
  };
  const clickMover = () => {
    try {
      if (!contenedor) { throw new Error("contenedor undefinide"); }
      validarMoverItem(
        numeroContenedor,
        contenedorID,
        entradaModalPallet,
        contenedor,
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
    <SafeAreaView style={isTablet ? styles.container : stylesCel.container}>
      <View style={isTablet ? null : stylesCel.viewButtonHide}>
        <Button title="Actualizar" onPress={clickActualizar} />
      </View>
      <View style={styles.viewTextInput}>
        <TextInput
          keyboardType="numeric"
          style={isTablet ? styles.textInput : stylesCel.textInput}
          value={String(cajas)}
          onChange={e => setCajas(Number(e.nativeEvent.text))} />
      </View>
      <View>
        <Button title="Sumar" onPress={clickSumar} />
      </View>
      <View style={isTablet ? null : stylesCel.viewButtonHide}>
        <Button title="Restar" onPress={clickRestar} />
      </View>
      <View style={isTablet ? null : stylesCel.viewButtonHide}>
        <Button title="Mover" onPress={ClickOpenMoverCajas} />
      </View>
      <View style={isTablet ? null : stylesCel.viewButtonHide}>
        <Button title="Editar" onPress={ClickOpenEditar}/>
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
                if (contenedores.length !== 0) {
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
            <TouchableOpacity
              onPress={() => {
                setCliente('Sin pallet');
                setContenedorID(-1);
                setModalVisible(false);
              }}>
              <Text style={styles.textList}>
                Sin pallet
              </Text>
            </TouchableOpacity>
            <FlatList
              data={contenedores}
              style={styles.pressableStyle}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCliente(
                      item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE,
                    );
                    setContenedorID(item.numeroContenedor);
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
  container: {
    backgroundColor: '#8B9E39',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 40,
  },
  buttons: {
    backgroundColor: '#390D52',
    width: 120,
    height: 60,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  textInput: {
    width: 150,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  viewTextInput: {
    display: 'flex',
  },
  centerModal: {
    display: 'flex',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalItems: {
    width: 500,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    padding: 10,
  },
  textModalHeader: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalInputView: {
    margin: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  modalInput: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
  },
  viewButtonsModal: {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonContenedores: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
    height: 50,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  textList: {
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    fontSize: 20,
  },
});

const stylesCel = StyleSheet.create({
  container: {
    backgroundColor: '#8B9E39',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    width: '100%',
  },
  buttons: {
    backgroundColor: '#390D52',
    width: 120,
    height: 60,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonHide: { display: 'none' },
  text: {
    color: 'white',
  },
  textInput: {
    width: 150,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    fontSize: 10,
    padding: 0,
  },
  viewTextInput: {
    display: 'flex',
  },
  centerModal: {
    display: 'flex',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalItems: {
    width: 500,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 30,
    shadowColor: 'black',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    padding: 10,
  },
  textModalHeader: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalInputView: {
    margin: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  modalInput: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
  },
  viewButtonsModal: {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonContenedores: {
    width: 350,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#7D9F3A',
    backgroundColor: '#F5F5F5',
    height: 50,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  textList: {
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    fontSize: 20,
  },
});
