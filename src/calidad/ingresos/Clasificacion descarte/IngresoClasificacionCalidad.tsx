
import React, { useEffect, useState } from "react";
import { lotesType } from "../../../../types/lotesType";
import { elementoDefectoType, elementoPorcentajeType } from "./types/clasificacionTypes";
import { FlatList, Alert, Button, ScrollView, StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import * as Keychain from 'react-native-keychain';
import IngresoDatos from "./components/IngresoDatos";
import ShowData from "./components/ShowData";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { fetchWithTimeout } from "../../../../utils/connection";
import { useAppContext } from "../../../hooks/useAppContext";

export default function IngresoClasificacionCalidad(): React.JSX.Element {
  const { url } = useEnvContext();
  const { setLoading } = useAppContext();
  const [lotesData, setLotesData] = useState<lotesType[]>([]);
  const [lote, setLote] = useState<lotesType>();
  const [dataArray, setDataArray] = useState<elementoDefectoType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //modal para confirmar

  useEffect(() => {
    getData();
  }, []);
  const getData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await getCredentials();
      const requestENF = await fetch(`${url}/calidad/get_lotes_clasificacion_descarte`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });
      const response: { status: number, data: any, message: string } = await requestENF.json();
      if (response.status !== 200) {
        throw new Error(`${response.message}`);
      }
      setLotesData(response.data);
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("error", `${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const eliminarItem = (index: number): void => {
    setDataArray(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1); // Eliminar el elemento en el índice especificado
      return newArray;
    });
  };
  const guardar = async (): Promise<void> => {
    try {
      if (!lote?._id) { throw new Error("Error, seleccione un lote"); }
      const total = dataArray.reduce((acu, item) => (acu += item.lavado + item.encerado), 0);
      if (total === 0) { throw new Error('No hay defectos agregados'); }
      const porcentages: elementoPorcentajeType[] = dataArray.map(item => {
        const totalDefecto = item.encerado + item.lavado;
        const porcentage = (totalDefecto) / total;
        return { defecto: item.defecto, porcentage: porcentage };
      });
      const dataObject: { [key: string]: number } = porcentages.reduce((acu: { [key: string]: number }, item) => {
        if (typeof item.defecto === 'string') {
          acu[`calidad.clasificacionCalidad.${item.defecto}`] = item.porcentage;
        }
        return acu;
      }, {});
      const request = {
        action: 'put_lotes_clasificacion_descarte',
        data: dataObject,
        _id: lote._id,
        __v: lote.__v,
      };
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        throw new Error("Error no hay token de validadcion");
      }
      const { password } = credentials;
      const token = password;
      const responseJSON = await fetchWithTimeout(`${url}/calidad/put_lotes_clasificacion_descarte`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify(request),
      });
      const response = await responseJSON.json();
      if (response.status !== 200) {
        throw new Error(`${response.message}`);
      }
      Alert.alert("Datos guardados con exito!");
      setDataArray([]);
      await getData();

    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(`${err.message}`);
      }
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Ingreso clasificación descarte</Text>

        <TouchableOpacity
          style={styles.botonLotes}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {lote ? `${lote.enf} ${lote.predio.PREDIO}` : 'Seleccione predio'}
          </Text>
        </TouchableOpacity>

        {/* Componente que ingresa datos */}
        <View style={styles.block}>
          <IngresoDatos setDataArray={setDataArray} />
        </View>

        {/* Componente para mostrar los datos ingresados */}
        <View style={styles.block}>
          <ShowData dataArray={dataArray} eliminarItem={eliminarItem} />
        </View>

        {/* Botón principal para guardar */}
        <View style={styles.saveButtonContainer}>
          <Button title="Guardar" onPress={guardar} />
        </View>
      </View>

      {/* Modal con lista de lotes */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={lotesData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    setLote(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.textList}>
                    {item.enf} -- {item.predio.PREDIO}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal que envuelve todo el ScrollView
  screen: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    width:'100%',
  },

  // Contenedor interno centrado y con separación
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // Título principal
  titleText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  botonLotes: {
    backgroundColor: '#FFFFFF',
    width: 250,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D9F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    fontSize: 15,
    color: '#333',
  },

  block: {
    width: '100%',
    marginVertical: 8,
  },

  saveButtonContainer: {
    marginTop: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    maxHeight: '60%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  // Estilo para TouchableOpacity en la lista
  pressableStyle: {
    marginVertical: 10,
  },
  textList: {
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 15
  },
});
