/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import * as strings from './json/strings_ES.json';
import { crear_request_guardar, formInit, formInitType, formLabels } from './functions/functions';
import { proveedoresType } from '../../../types/proveedoresType';
import { Alert, Text, View, StyleSheet, ScrollView, ActivityIndicator, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getCredentials } from '../../../utils/auth';
import useEnvContext from '../../hooks/useEnvContext';
import { fetchWithTimeout } from '../../../utils/connection';


//recordar despues cambiar para que inventario quede en un item aparte, pues canastilla en inventario va a caqmbiar a un solo json
export default function IngresoFruta(): React.JSX.Element {
  const { url } = useEnvContext();
  const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([]);
  const [formState, setFormState] = useState<formInitType>(formInit);
  const [enf, setEnf] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [nombrePredio, setNombrePredio] = useState<string>();

  useEffect(() => {
    const obtenerPredios = async (): Promise<void> => {
      try {
        setLoading(true);
        const token = await getCredentials();
        const requesOperariosJSON = await fetch(`${url}/comercial/get_proveedores_proceso`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `${token}`,
          },
        });
        const response = await requesOperariosJSON.json();
        if (response.status !== 200) {
          throw new Error(`Cose ${response.status}: ${response.message}`);

        }
        const arr = response.data;
        arr.sort((a: proveedoresType, b: proveedoresType) => a.PREDIO.localeCompare(b.PREDIO));
        setPrediosData(arr);
      } catch (err) {
        if (err instanceof Error) {
          Alert.alert("error", `${err.message}`);

        }
      } finally {
        setLoading(false);
      }
    };
    obtenerPredios();
    obtenerEF1();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  const handlePredio = (predioID: string): void => {
    setFormState({
      ...formState,
      nombrePredio: predioID,
    });
  };
  const obtenerEF1 = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await getCredentials();
      const requesOperariosJSON = await fetch(`${url}/proceso/obtenerEF1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`,
        },
      });
      const response = await requesOperariosJSON.json();
      if (response.status !== 200) {
        throw new Error(`Cose ${response.status}: ${response.message}`);
      }
      setEnf(response.data);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert("error", `${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const guardarLote = async () => {
    try {
      const datos = crear_request_guardar(formState);
      if (datos.promedio < 15 || datos.promedio > 30) {
        Alert.alert('Error, los kilos no corresponden a las canastillas');
        return;
      }
      if (!datos.tipoFruta) {
        Alert.alert('Seleccione el tipo de fruta del lote');
        return;
      }
      const data = { ...datos, enf: enf };
      const request = {
        data: data,
        action: 'guardarLote',
      };
      const token = await getCredentials();

      const responseJSON = await fetchWithTimeout(`${url}/proceso/guardarLote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify(request),
      });
      const response = await responseJSON.json();
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      Alert.alert("Guardado con exito");
      reiniciarCampos();
      obtenerEF1();
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert('Recepcion' + e.message);
      }
    }
  };
  const reiniciarCampos = (): void => {
    setFormState(formInit);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {loading ?
        <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
        :
        <View style={styles.formContainer}>
          <View>
            <Text>{strings.title}</Text>
            <Text>{enf}</Text>
          </View>

          <View>
            <Text style={styles.textInputs}>{strings.input_predios}</Text>
            <View style={styles.inputs}>
              <Picker
                selectedValue={nombrePredio}
                style={styles.picker}
                onValueChange={(itemValue: string) => {
                  handlePredio(itemValue);
                  setNombrePredio(itemValue);
                }}
              >
                <Picker.Item label="" value="Predio" />
                {prediosDatos && prediosDatos.map(predio => (
                  <Picker.Item
                    label={`${predio.PREDIO}`}
                    value={predio._id}
                    key={predio._id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.textInputs}>{strings.tipoFruta.title}</Text>
            <View style={styles.inputs}>
              <Picker
                selectedValue={formState.tipoFruta}
                style={styles.picker}
                onValueChange={(itemValue: string) => {
                  setFormState({
                    ...formState,
                    ["tipoFruta"]: itemValue,
                  });
                }}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label={`Limon`} value={"Limon"} />
                <Picker.Item label={`Naranja`} value={"Naranja"} />

              </Picker>
            </View>
            {Object.keys(formLabels).map(item => {
              if (!['nombrePredio', 'tipoFruta'].includes(item)) {
                return (
                  <View style={styles.containerForm} key={item}>
                    <Text style={styles.textInputs}>{formLabels[item as keyof formInitType]}</Text>
                    <TextInput
                      style={styles.inputs}
                      placeholder=""
                      inputMode="numeric"
                      onChangeText={(value): void => {
                        setFormState({
                          ...formState,
                          [`${item}`]: value,
                        });
                      }}
                    />
                  </View>
                );
              } else {
                return null;
              }
            })}
          </View>
          <View style={styles.viewBotones}>
            <Button title="Guardar" color="#49659E" onPress={guardarLote} />
          </View>
        </View>
      }
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 250,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  viewBotones: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  containerForm: {
    marginTop: 25,
  },
  inputs: {
    borderWidth: 2,
    borderColor: "skyblue",
    width: 250,
    paddingTop: 5,
    margin: 10,
    borderRadius: 10,
    paddingLeft: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  textInputs: { marginTop: 5, fontSize: 15, fontWeight: "bold" },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    width: '90%', // Ajusta este valor según necesites
    alignItems: 'center',
  },
});
