/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { formInit, labels, sumarDatos } from "./func/functions";
import { FormCategory, FormState, datosPredioType } from "./types/types";
import * as Keychain from "react-native-keychain";
const URL = "http://192.168.0.172:3010";

export default function DescarteLavado(): React.JSX.Element {
    const [formState, setFormState] = useState<FormState>(formInit);
    const [loading, setLoading] = useState<boolean>(false);
    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });
    const fetchWithTimeout = (url:string, options:object, timeout = 5000):any => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            ),
        ]);
    };
    const obtenerLote = async () => {
        try {
            setLoading(true);
            const requestENF = await fetch(`${URL}/variablesDeProceso/predioProcesoDescarte`);
            const responseServerPromise = await requestENF.json();
            const response: datosPredioType = responseServerPromise.response;
            setDatosPredio({
                _id: response._id,
                enf: response.enf,
                tipoFruta: response.tipoFruta,
                nombrePredio: response.nombrePredio,
            });
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (name: keyof FormState, value: number, type: keyof FormCategory): void => {
        setFormState((prevState) => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            [type]: value,
          },
        }));
    };
    const guardarDatos = async ():Promise<any> => {
        try{
            if (datosPredio.enf === "") {
                throw new Error("Recargue el predio que se está vaciando");
            }
            setLoading(true);
            const data = sumarDatos(formState, datosPredio);
            const request = {
                action: "ingresar_descarte_lavado",
                _id: datosPredio._id,
                data: data,
            };
            const credentials = await Keychain.getGenericPassword();
            if(!credentials){
                throw new Error("Error no hay token de validadcion");
            }
            const { password } = credentials;
            const token = password;
            const responseJSON = await fetchWithTimeout(`${URL}/proceso/ingresar_descarte_lavado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            Alert.alert("Guardado con exito");
        } catch(err){
            if(err instanceof Error){
                Alert.alert(`${err.name}: ${err.message}`);
            }
        } finally {
            setFormState(formInit);
            setLoading(false);
            setDatosPredio({
                _id: "",
                enf: "",
                tipoFruta: "",
                nombrePredio: "",
            });
        }
    };

    return (
        <ScrollView style={styles.constainerScroll}>
            {loading === false ? (
                <View style={styles.container}>
                    <Text style={styles.textInputs}>
                        Descarte Lavado
                    </Text>
                    <Text>Numero de lote:</Text>
                    <Text>{datosPredio.nombrePredio}</Text>
                    <Text>{datosPredio.enf}</Text>
                    <Button
                        color="#49659E"
                        title="Cargar predio"
                        onPress={obtenerLote}
                    />
                    {Object.keys(labels).map(item  => (
                        <View style={styles.containerForm} key={item}>
                            <Text style={styles.textInputs}>{labels[item as keyof typeof labels]}</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="N. de canastillas"
                                inputMode="numeric"
                                onChangeText={(value):void => handleChange(item as keyof FormState, Number(value), "canastillas")}
                            />
                            <TextInput
                                style={styles.inputs}
                                placeholder="Kilos"
                                inputMode="numeric"
                                onChangeText={(value):void => handleChange(item as keyof FormState, Number(value), "kilos")}
                            />
                        </View>
                    ))}
                    <View style={styles.viewBotones}>
                        <Button title="Guardar" color="#49659E" onPress={guardarDatos}/>
                    </View>
                </View>) : (
                <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    constainerScroll: { width: "100%" },
    container: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        top: 30,
        backgroundColor: "#EEFBE5",
        paddingTop: 10,
        paddingBottom: 50,
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
    loader: {
        marginTop: 250,
    },
    viewBotones: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },
});

