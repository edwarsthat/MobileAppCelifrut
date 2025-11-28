import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useAppStore } from "../../../stores/useAppStore";
import useTipoFrutaStore from "../../../stores/useTipoFrutaStore";
import useForm from "../../../hooks/useForm";
import { datosPredioType, formInit, formType, schemaForm } from "./validations";
import { descartesType } from "../../../../types/tiposFrutas";
import FormInput from "../../../UI/components/FormInput";
import { useSocketStore } from "../../../stores/useSocketStore";
import { getCredentials } from "../../../../utils/auth";

export default function DescarteEncerado(): JSX.Element {
    const setLoading = useAppStore(state => state.setLoading);
    const loading = useAppStore(state => state.loading);
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta);
    const socketRequest = useSocketStore(state => state.sendRequest);

    const [descartes, setDescartes] = useState<descartesType[]>([]);
    const { formState, handleFieldChange, resetForm, formErrors, validateForm } = useForm<formType>(formInit);

    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });

    useEffect(() => {
        obtenerLote();
    }, []);

    const obtenerLote = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await getCredentials();
            const response = await socketRequest({
                token,
                data: { action: "get_proceso_aplicaciones_descarteLavado" }
            });

            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }

            setDatosPredio({
                _id: response.data._id,
                enf: response.data.loteId.enf,
                tipoFruta: response.data.tipoFruta.tipoFruta,
                nombrePredio: response.data.predio.PREDIO,
            });

            const tipoFrutaFind = tiposFruta.find((item) => item._id === response.data.tipoFruta._id);
            if (tipoFrutaFind) {
                const descarteSeccion = tipoFrutaFind.descartes.filter((item) => item.seccion.includes("encerado"));
                setDescartes(descarteSeccion as descartesType[]);
            }
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error", err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const guardarDatos = async (): Promise<void> => {
        try {
            setLoading(true);
            const result = validateForm(schemaForm);
            if (!result) return;

            const token = await getCredentials();
            const request = {
                token,
                data: {
                    action: "put_proceso_aplicaciones_descarte",
                    registroFrutaProcesada: datosPredio._id,
                    data: formState,
                    tipo: "ENCERADO"
                }
            };

            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            Alert.alert("Éxito", "Guardado con exito");
            resetForm();
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error", `${err.name}: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Descarte Encerado</Text>

            <View style={styles.card}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Predio: {datosPredio.nombrePredio}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>{datosPredio.enf}</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Tipo de descarte</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formState.descarte}
                        onValueChange={(itemValue) => handleFieldChange("descarte", itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione un descarte" value="" />
                        {descartes.map((item) => (
                            <Picker.Item key={item._id} label={item.descripcion} value={item._id} />
                        ))}
                    </Picker>
                </View>
                {formErrors.descarte && <Text style={styles.errorText}>{formErrors.descarte}</Text>}

                <FormInput
                    label="Numero de canastillas"
                    value={formState.canastillas}
                    onChangeText={(text) => handleFieldChange("canastillas", text)}
                    error={formErrors.canastillas}
                    type="numeric"
                    placeholder="0"
                />

                <FormInput
                    label="Numero de kilos"
                    value={formState.kilos}
                    onChangeText={(text) => handleFieldChange("kilos", text)}
                    error={formErrors.kilos}
                    type="numeric"
                    placeholder="0"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={guardarDatos}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
        width: "100%",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7f8c8d',
    },
    value: {
        fontSize: 16,
        color: '#2c3e50',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputLabel: {
        fontSize: 14,
        color: '#2c3e50',
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e1e8ed',
        borderRadius: 6,
        marginBottom: 5,
        backgroundColor: '#f8f9fa',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    errorText: {
        color: '#E74C3C',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#7EBA27',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#a5d6a7',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
