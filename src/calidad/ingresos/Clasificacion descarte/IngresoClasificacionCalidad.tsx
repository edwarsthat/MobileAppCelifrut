/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import { lotesType } from "../../../../types/lotesType";
import { elementoDefectoType, elementoPorcentajeType } from "./types/clasificacionTypes";
import { FlatList, Alert, Button, ScrollView, StyleSheet, View, ActivityIndicator, Text, Modal, TouchableOpacity } from "react-native";
import * as Keychain from 'react-native-keychain';
import IngresoDatos from "./components/IngresoDatos";
import ShowData from "./components/ShowData";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { fetchWithTimeout } from "../../../../utils/connection";

export default function IngresoClasificacionCalidad(): React.JSX.Element {
  const {url} = useEnvContext();
  const [lotesData, setLotesData] = useState<lotesType[]>([]);
  const [lote, setLote] = useState<lotesType>();
  const [dataArray, setDataArray] = useState<elementoDefectoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
    <ScrollView>
      {loading ? <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />

        :
        <View style={styles.container}>
          <Text style={styles.textInputs}>Ingreso clasificación descarte</Text>
          <View>
            <TouchableOpacity style={styles.botonLotes}
              onPress={() => setModalVisible(true)}>
              <Text>{lote ? lote.enf + " " + lote.predio.PREDIO : 'Seleccione predio'}</Text>
            </TouchableOpacity>
            <View>
              <IngresoDatos setDataArray={setDataArray} />
            </View>
            <ShowData dataArray={dataArray} eliminarItem={eliminarItem} />
          </View>
          <Button title="Guardar" onPress={guardar} />

        </View>
      }

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centerModal}>
          <View style={styles.viewModal}>

            <FlatList
              data={lotesData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    setLote(item);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.textList}>{item.enf} -- {item.predio.PREDIO}</Text>
                </TouchableOpacity>)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 250,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingBottom: 8,
  },
  textInputs: { marginTop: 5, fontSize: 15, fontWeight: "bold" },
  botonLotes: {
    backgroundColor: 'white',
    width: 250,
    height: 50,
    marginLeft: '5%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D9F3A',
    justifyContent: 'center',
    alignItems: 'center',
  }, centerModal: {
    flex: 1,
    alignItems: 'center',
    marginTop: '18%',
  },
  viewModal: {
    backgroundColor: 'white',
    width: '90%',
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  pressableStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  textList: {
    color: 'black',
    marginLeft: 10,
    marginRight: 15,
    fontSize: 18,
  },
});
