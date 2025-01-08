import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Alert, TextInput } from "react-native";
import { formInit, labels, sumarDatos } from "./func/functions";
import { FormCategory, FormState, datosPredioType } from "./types/types";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { fetchWithTimeout } from "../../../../utils/connection";
import { useAppContext } from "../../../hooks/useAppContext";

export default function DescarteEncerado(): React.JSX.Element {
    const { url } = useEnvContext();
    const { setLoading } = useAppContext();
    const [formState, setFormState] = useState<FormState>(formInit);
    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });

    const obtenerLote = async () => {
        try {
            setLoading(true);
            const requestENF = await fetch(`${url}/variablesDeProceso/predioProcesoDescarte`);
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
                action: "ingresar_descarte_encerado",
                _id: datosPredio._id,
                data: data,
            };
            const token = await getCredentials();
            const responseJSON = await fetchWithTimeout(`${url}/proceso/ingresar_descarte_encerado`, {
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
            console.log(formInit);
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
                <View style={styles.container}>
                    <Text style={styles.textInputs}>
                        Descarte Encerado
                    </Text>
                    <Text>Numero de lote:</Text>
                    <Text>{datosPredio.nombrePredio}</Text>
                    <Text>{datosPredio.enf}</Text>
                    <Button
                        color="#49659E"
                        title="Cargar predio"
                        onPress={obtenerLote}
                    />
                    {Object.keys(labels).map(item => (
                        <View style={styles.containerForm} key={item}>
                            <Text style={styles.textInputs}>{labels[item as keyof typeof labels]}</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="N. de canastillas"
                                inputMode="numeric"
                                value={String(formState[item as keyof FormState].canastillas || '')}
                                onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), "canastillas")}
                            />
                            <TextInput
                                style={styles.inputs}
                                placeholder="Kilos"
                                inputMode="numeric"
                                value={String(formState[item as keyof FormState].kilos || '')}
                                onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), "kilos")}
                            />
                        </View>
                    ))}
                    <View style={styles.viewBotones}>
                        <Button title="Guardar" color="#49659E" onPress={guardarDatos} />
                    </View>
                </View>

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    constainerScroll: {
        width: "100%",
        backgroundColor: "#f5f5f5", // Fondo claro para toda la vista
        paddingHorizontal: 16, // Espaciado lateral para el contenido
    },
    container: {
        width: "100%",
        alignItems: "center",
        marginTop: 30,
        backgroundColor: "#EEFBE5", // Fondo verde suave
        paddingVertical: 20, // Espaciado vertical
        paddingHorizontal: 16, // Espaciado horizontal
        borderRadius: 10, // Bordes redondeados
        elevation: 3, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    containerForm: {
        marginTop: 25,
        width: "100%",
        alignItems: "center",
    },
    inputs: {
        borderWidth: 1,
        borderColor: "#7D9F3A", // Verde suave para los bordes
        width: "90%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#fff", // Fondo blanco para contraste
        elevation: 2, // Sombra para los inputs
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    textInputs: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333", // Texto más oscuro
        marginBottom: 5,
    },
    loader: {
        marginTop: 250,
        alignSelf: "center",
    },
    viewBotones: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 20,
    },
});

