/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TextInput, Button, Alert } from "react-native";
import { lotesType } from "../../../../../types/lotesType";
import * as Keychain from "react-native-keychain";
import useEnvContext from "../../../../hooks/useEnvContext";
import { fetchWithTimeout } from "../../../../../utils/connection";

type propsType = {
    lote: lotesType | undefined
    volverToTabla: () => void

}

export default function FrutaSinProcesarDesverdizado(props: propsType): React.JSX.Element {
    const {url} = useEnvContext();
    const [canastillas, setCanastillas] = useState<string>();
    const [cuartodesverdizado, setCuartoDesverdizado] = useState<string>();


    const desverdizado = async () => {
        try {
            if (props.lote === undefined) {
                throw new Error("Error lote indefinido");
            }
            const propsCanastillasInt = props.lote.inventario ? props.lote.inventario : 0;
            if (Number(canastillas) > propsCanastillasInt) {
                throw new Error("Error en el numero de canastillas!");
            }
            const request = {
                inventario: Number(canastillas),
                _id: props.lote._id,
                desverdizado: {
                    canastillasIngreso: canastillas,
                    kilosIngreso: props.lote.promedio ? (Number(canastillas) * props.lote.promedio) : 0,
                    cuartoDesverdizado: cuartodesverdizado,
                },
                __v: props.lote.__v,
                action: 'desverdizado',
            };
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error("Error no hay token de validadcion");
            }
            const { password } = credentials;
            const token = password;
            const responseJSON = await fetchWithTimeout(`${url}/proceso/desverdizado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            Alert.alert("Directo nacional con exito");
            props.volverToTabla();
            setCanastillas('');
            setCuartoDesverdizado('');
        } catch (err) {
            if (err instanceof Error) {
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
                <View style={styles.containerForm}>
                    <Text style={styles.textInputs}>Numero de canastillas:</Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder=""
                        inputMode="text"
                        onChangeText={setCanastillas}
                    />
                </View>

                <View style={styles.containerForm}>
                    <Text style={styles.textInputs}>Cuarto desverdizado:</Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder=""
                        inputMode="text"
                        onChangeText={setCuartoDesverdizado}
                    />
                </View>
                <View style={styles.viewBotones}>
                    <Button title="Guardar" color="#49659E" onPress={desverdizado} />
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
        marginBottom: 180,
    },
});
