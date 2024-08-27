/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, TextInput, Button, Alert } from "react-native";
import { lotesType } from "../../../../../types/lotesType";
import { forminit, formType, labels } from "../functions/forms";
import * as Keychain from "react-native-keychain";
const URL = "http://192.168.0.172:3010";

type propsType = {
    lote: lotesType | undefined
    volverToTabla: () => void
}

export default function FrutaSinProcesarDirectoNacional(props: propsType): React.JSX.Element {
    const [formState, setFormState] = useState<formType>(forminit);

    const fetchWithTimeout = (url:string, options:object, timeout = 5000):any => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            ),
        ]);
    };
    const directoNacional = async () => {
        try{
            if(props.lote === undefined){
                throw new Error("Error lote indefinido");
            }
            const propsCanastillasInt = props.lote.inventario ? props.lote.inventario : 0;
            if(Number(formState.canastillas) > propsCanastillasInt){
                throw new Error("Error en el numero de canastillas!");
            }
            const request = {
                _id: props.lote._id,
                infoSalidaDirectoNacional: {
                  placa: formState.placa,
                  nombreConductor: formState.nombreConductor,
                  telefono: formState.telefono,
                  cedula: formState.cedula,
                  remision: formState.remision,
                },
                directoNacional: props.lote.promedio ? (Number(formState.canastillas) * props.lote.promedio) : 0,
                inventario: Number(formState.canastillas),
                __v: props.lote.__v,
                action: 'directoNacional',
              };
              const credentials = await Keychain.getGenericPassword();
              if(!credentials){
                  throw new Error("Error no hay token de validadcion");
              }
              const { password } = credentials;
              const token = password;
              const responseJSON = await fetchWithTimeout(`${URL}/proceso/directoNacional`, {
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
              Alert.alert("Directo nacional con exito");
              props.volverToTabla();
              setFormState(forminit);
        } catch(err){
            if(err instanceof Error){
                Alert.alert(err.message);
            }
        }
    };

    if (props.lote === undefined) {
        return (
            <View>
                <Text>No se ha seleccionado lote...</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.constainerScroll}>
            <View style={styles.container}>
                <Text>{props.lote.enf}</Text>
                <Text>{props.lote.predio.PREDIO}</Text>
                <Text>Numero de canastillas: {props.lote.inventario}</Text>
                {Object.keys(labels).map(item => (
                    <View style={styles.containerForm} key={item}>
                        <Text style={styles.textInputs}>{labels[item as keyof typeof labels]}</Text>
                        <TextInput
                            style={styles.inputs}
                            placeholder=""
                            inputMode="text"
                            onChangeText={(value) => {
                                setFormState({
                                    ...formState,
                                    [`${item}`]: value,
                                });
                            }}
                        />
                    </View>
                ))}
                <View style={styles.viewBotones}>
                    <Button title="Guardar" color="#49659E" onPress={directoNacional} />
                    <Button title="Volver" color="red" onPress={props.volverToTabla} />

                </View>
            </View>

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
    viewBotones: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        marginBottom:180,
    },
});
