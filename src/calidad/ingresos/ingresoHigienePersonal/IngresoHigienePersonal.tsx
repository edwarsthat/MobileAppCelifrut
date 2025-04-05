import React, { useEffect, useState } from "react";
import {
    Switch,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { formatoInit, FormatoType } from "./formularios/formulario";
import { userType } from "../../../../types/cuentas";
import { getCredentials } from "../../../../utils/auth";
import useEnvContext from "../../../hooks/useEnvContext";
import { fetchWithTimeout } from "../../../../utils/connection";
import { useAppContext } from "../../../hooks/useAppContext";
import HorizontalLine from "../../../components/HorizontalLine";
import formato from "./formularios/formularioCalidad0.0.1.json";

export default function IngresoHigienePersonal(): React.JSX.Element {
    const { url: URL } = useEnvContext();
    const { setLoading } = useAppContext();


    const [operariosOri, setOperariosOri] = useState<userType[]>();
    const [operarios, setOperarios] = useState<userType[]>();

    const [query, setQuery] = useState('');
    const [selectedOperario, setSelectedOperario] = useState<userType | null>(null);

    const [showOperarios, setShowOperarios] = useState<boolean>(true);
    const [formState, setFormState] = useState<FormatoType>(formatoInit);

    useEffect(() => {
        obtenerOperarios();
    }, []);

    const obtenerOperarios = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await getCredentials();
            const requesOperariosJSON = await fetch(`${URL}/Calidad/get_calidad_ingresos_higienePersonal`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            const response = await requesOperariosJSON.json();
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            setOperarios(response.data);
            setOperariosOri(response.data);
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
                data: {
                    ...formState,
                    operario: selectedOperario?._id,
                },
            };
            const token = await getCredentials();
            const responseJSON = await fetchWithTimeout(`${URL}/Calidad/post_calidad_ingresos_higienePersonal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();

            if (response.status !== 200) {
                throw new Error(`Code: ${response.status}: ${response.message}`);
            }
            Alert.alert("success", "Datos guardado con éxito!");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("error", err.message);
            }
        } finally {
            setFormState(formatoInit);
            setSelectedOperario(null);
            setShowOperarios(true);
        }
    };

    const handleChange = (event: boolean, key: string): void => {
        setFormState({
            ...formState,
            [key]: event,
        });
    };

    useEffect(() => {
        if (query === '') {
            setOperarios(operariosOri);
        } else {
            if (operarios === undefined) { return; }
            const results = operarios.filter(op =>
                `${op.nombre} ${op.apellido}`.toLowerCase().includes(query.toLowerCase())
            );
            setOperarios(results);
        }
    }, [query]);

    const handleSelectOperario = (op: userType) => {
        setSelectedOperario(op);
        setQuery(`${op.nombre} ${op.apellido}`);
        setOperarios([]);
        setShowOperarios(false);
    };

    return (
        <View style={styles.componentContainer}>
            <Text style={styles.title}>Ingreso Higiene Personal</Text>
            <HorizontalLine />

            <View style={styles.operarioInputContainer}>
                <TextInput
                    onChangeText={(text) => setQuery(text)}
                    style={styles.inputs}
                    value={query}
                    placeholder="Escribe nombre del operario"
                    inputMode="text"
                />
            </View>

            {showOperarios &&

                <View style={styles.centerListOperarios}>
                    <FlatList
                        data={operarios}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectOperario(item)}
                            >
                                <Text style={styles.listItemText}>
                                    {item.nombre} - {item.apellido}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            }

            {!showOperarios &&

                <ScrollView style={styles.formulariosContainer}>
                    {Object.entries(formato).map(([key, value]) => {
                        if (key !== "version" && key !== "responsable") {
                            return (
                                <View key={key} style={styles.formulariosCheckbox}>
                                    <Text style={styles.checkboxText}>{value}</Text>
                                    <Switch
                                        value={formState[key as keyof FormatoType]}
                                        onValueChange={(e) => handleChange(e, key)}
                                        trackColor={{ false: "#ccc", true: "#4CAF50" }}
                                        thumbColor={formState[key as keyof FormatoType] ? "#FFFFFF" : "#f4f3f4"}
                                        style={styles.switch}
                                    />

                                </View>
                            );
                        } else {
                            return null;
                        }
                    })}
                    <TouchableOpacity style={styles.button} onPress={handleGuardar}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </ScrollView>}

        </View>
    );
}
const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
        alignItems: "center",
        width:"100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginVertical: 20,
        textAlign: "center",
    },
    operarioInputContainer: {
        width: "100%",
        alignItems: "center",
    },
    inputs: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        marginBottom: 10,
    },
    centerListOperarios: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        marginTop: 4,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    listItemText: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    formulariosContainer: {
        width: "100%",
        marginTop: 15,
    },
    formulariosCheckbox: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        alignSelf: "center",
        // Sombra sutil para caja
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    checkboxText: {
        flex: 1,
        fontSize: 16,
        color: "#333333",
        marginRight: 8,
    },
    switch: {
        transform: [{ scaleX: 1 }, { scaleY: 1 }],
    },
    button: {
        width: "90%",
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 16,
        // Sombra para el botón
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    autocompleteInput: {
        borderColor: "#DDDDDD",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        height: 40,
        marginVertical: 5,
        fontSize: 16,
    },
    itemText: {
        padding: 10,
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 1,
        fontSize: 16,
    },
    selected: {
        marginTop: 10,
        fontWeight: "bold",
    },
});
