import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Alert } from "react-native";
import { getCredentials } from "../../../../utils/auth";
import { useAppStore } from "../../../stores/useAppStore";
import { FormCategory, formInit, formSchema, FormState, labelsForm } from "./validations/validations";
import FormInput from "../../../UI/components/FormInput";
import useForm from "../../../hooks/useForm";
import { datosPredioType } from "./types/types";
import useTipoFrutaStore from "../../../stores/useTipoFrutaStore";
import { sumarDatos } from "./func/functions";
import { useSocketStore } from "../../../stores/useSocketStore";

export default function DescarteEncerado(): React.JSX.Element {
    const tiposFrutas = useTipoFrutaStore((state) => state.tiposFruta);
    const setLoading = useAppStore((state) => state.setLoading);
    const loading = useAppStore((state) => state.loading);
    const lastMessage = useSocketStore((state) => state.lastMessage);
    const socketRequest = useSocketStore(state => state.sendRequest);

    const { formState, setFormState, validateForm, formErrors, resetForm } = useForm<FormState>(formInit);
    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });
    const obtenerLote = async () => {
        try {
            setLoading(true);
            const token = await getCredentials();
            const request = {
                token: token,
                data: { action: "get_proceso_aplicaciones_descarteLavado" },
            };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al obtener el lote: ${response.message}`);
            }
            setDatosPredio({
                _id: response.data._id,
                enf: response.data.enf,
                tipoFruta: response.data.tipoFruta,
                nombrePredio: response.data.nombrePredio,
            });
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const guardarDatos = async (): Promise<any> => {
        try {
            if (datosPredio.enf === "") {
                throw new Error("Recargue el predio que se está vaciando");
            }
            const isValid = validateForm(formSchema);
            if (!isValid) {
                return;
            }
            setLoading(true);
            const data = sumarDatos(formState, datosPredio, tiposFrutas);
            const token = await getCredentials();
            const request = {
                token: token,
                data: { action: "put_proceso_aplicaciones_descarteEncerado", data: data, _id: datosPredio._id },
            };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            Alert.alert("Guardado con exito");
            resetForm();
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.name}: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (lastMessage?.event === 'predio_vaciado') {
            obtenerLote();
            Alert.alert("El predio ha sido vaciado. Se actualizará la información.");
        }
    }, [lastMessage]);
    useEffect(() => {
        obtenerLote();
    }, []);
    const handleChange = (name: keyof FormState, value: number, type: keyof FormCategory): void => {
        setFormState({
            ...formState,
            [name]: {
                ...formState[name],
                [type]: value,
            },
        });

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

                {Object.keys(labelsForm).map(item => (
                    <View style={styles.containerForm} key={item}>
                        <Text style={styles.textInputs}>{labelsForm[item as keyof typeof labelsForm]}</Text>
                        <FormInput
                            label="N° de canastillas"
                            value={String(formState[item as keyof FormState].canastillas || '')}
                            onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), 'canastillas')}
                            placeholder="N. de canastillas"
                            type="numeric"
                            error={formErrors[item as keyof FormState]}
                        />
                        <FormInput
                            label="Kilos"
                            value={String(formState[item as keyof FormState].kilos || '')}
                            onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), 'kilos')}
                            placeholder="Kilos"
                            type="numeric"
                            error={formErrors[item as keyof FormState]}
                        />
                    </View>
                ))}
                <View style={styles.viewBotones}>
                    <Button disabled={loading} title="Guardar" color="#49659E" onPress={guardarDatos} />
                </View>
            </View>

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    constainerScroll: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 16,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
    },
    containerForm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 20,
        width: '100%',
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

