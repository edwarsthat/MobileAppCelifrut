/* eslint-disable prettier/prettier */
import React from "react";
import { Alert, StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Switch } from "react-native";
const URL = "http://192.168.0.172:3010";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import formato from "./formularios/formularioCalidad0.0.1.json";
import { formatoInit, FormatoType } from "./formularios/formulario";
import { userType } from "../../../../types/cuentas";
import { getCredentials } from "../../../../utils/auth";

export default function IngresoHigienePersonal(): React.JSX.Element {
    const [operarios, setOperarios] = useState<userType[]>();
    const [operario, setOperario] = useState<string>();
    const [formState, setFormState] = useState<FormatoType>(formatoInit);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchWithTimeout = (url: string, options: object, timeout = 5000): any => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            ),
        ]);
    };


    useEffect(() => {
        obtenerOperarios();
    }, []);

    const obtenerOperarios = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await getCredentials();
            const requesOperariosJSON = await fetch(`${URL}/sistema/obtener_operarios_higiene`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${token}`,
                },
            });
            const response = await requesOperariosJSON.json();
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            setOperarios(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("error", err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleGuardar = async (): Promise<void> => {
        try {
            const request = {
                action: "add_higiene_personal",
                data: {
                    ...formState,
                    operario: operario,
                },
            };
            const token = await getCredentials();
            const responseJSON = await fetchWithTimeout(`${URL}/sistema/add_higiene_personal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();

            if (response.status !== 200) {
                throw new Error(`Code: ${response.status}: ${response.message}`);
            }
            Alert.alert('success', 'Datos guardado con exito!');
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert('error', err.message);
            }
        } finally {
            setFormState(formatoInit);
            setOperario('');
        }
    };
    const handleChange = (event:boolean, key:string): void => {
        setFormState({
            ...formState,
            [key]: event,
          });
    };
    return (

        <View style={styles.componentContainer}>
            <Text style={styles.title}>Ingreso Higiene Personal</Text>
            <ScrollView style={styles.formContainer}>
                {loading ? <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
                    :
                    <>
                        <View style={styles.pickerContainer}>
                            <Text>{formato.responsable}</Text>
                            <Picker
                                selectedValue={operario}
                                style={styles.picker}
                                onValueChange={(itemValue) => setOperario(itemValue)}
                            >
                                <Picker.Item label="" value="" />
                                {operarios && operarios.map(operarioItem => (
                                    <Picker.Item
                                        label={`${operarioItem.nombre} ${operarioItem.apellido}`}
                                        value={operarioItem._id}
                                        key={operarioItem._id}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.formulariosContainer}>
                            {Object.entries(formato).map(([key, value]) => {
                                if (key !== "version" && key !== 'responsable') {
                                    return (
                                        <View key={key} style={styles.formulariosCheckbox}>
                                            <Text style={styles.checkboxText}>{value}</Text>
                                            <Switch
                                                value={formState[key] as boolean}
                                                onValueChange={(e) => handleChange(e, key)}
                                                style={styles.switch}
                                            />
                                        </View>
                                    );
                                } else { return null; }
                            })}
                        </View>
                    </>
                }
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGuardar}
                >
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    formContainer: {
        padding: 10,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    formulariosContainer: {
        justifyContent: 'space-between',
    },
    formulariosCheckbox: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        padding: 7,
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 15,
        flex: 1,
        marginRight: 10,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 250,
    },
});
