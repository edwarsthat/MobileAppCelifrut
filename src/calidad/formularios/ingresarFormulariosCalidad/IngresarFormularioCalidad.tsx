/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, StyleSheet, Text, View, ActivityIndicator, Switch, TextInput } from "react-native";
import { getCredentials } from "../../../../utils/auth";
import useEnvContext from "../../../hooks/useEnvContext";
import { Picker } from "@react-native-picker/picker";
import { LimpiezaDiariaType } from "../../../../types/limpieza_diaria";
import HorizontalLine from "../../../components/HorizontalLine";
import { control_plagas, limpieza_diaria, limpieza_mensual } from "./formSchema";
import { formType, LimpiezaObjectType } from "./types";

export default function IngresarFormularioCalidad(): React.JSX.Element {
    const { url } = useEnvContext();
    const [formularios, setFormularios] = useState<LimpiezaDiariaType[]>();
    const [formularioSeleccionado, setFormularioSeleccionado] = useState<LimpiezaDiariaType>();
    const [areaSeleccionada, setAreaSeleccionada] = useState<string>();
    const [tipoFormulario, setTipoFormulario] = useState<LimpiezaObjectType>();
    const [formData, setFormData] = useState<formType>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        obtener_formularios_existentes();
    }, [url]);
    const obtener_formularios_existentes = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await getCredentials();

            const requesOperariosJSON = await fetch(`${url}/calidad/get_formularios_calidad_creados`, {
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
            setFormularios(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const handle_select_formulario = (id: string): void => {
        if (formularios !== undefined) {
            const select = formularios.find(item => item._id === id);

            if (!select) { return Alert.alert("Error, formulario no existe"); }

            setAreaSeleccionada('');
            setFormularioSeleccionado(select);
            switch (select.formulario) {
                case 'Limpieza diaría':
                    setTipoFormulario(limpieza_diaria);
                    break;
                case 'Limpieza mensual':
                    setTipoFormulario(limpieza_mensual);
                    break;
                case 'Control de plagas':
                    setTipoFormulario(control_plagas);
                    break;
                default:
                    break;
            }
        }
    };
    const handle_select_area = (area: string): void => {
        if (tipoFormulario !== undefined) {
            setAreaSeleccionada(area);
            const obj: formType = {};

            tipoFormulario[area].forEach(item => {
                obj[item.key] = {
                    status: false,
                    observaciones: '',
                };
            });
            setFormData(obj);

        }
    };
    const handle_cumple_checkbox = (e: boolean, item: string): void => {
        if (formData !== undefined) {
            setFormData(prevFormData => {
                if(prevFormData !== undefined){
                    return ({
                        ...prevFormData,
                        [item]: {
                            ...prevFormData[item],
                            status: e,
                        },
                    });
                }
            });
        }
    };
    const handle_observaciones = (e:string, item:string):void => {
        if (formData !== undefined) {
            setFormData(prevFormData => {
                if(prevFormData !== undefined){
                    return ({
                        ...prevFormData,
                        [item]: {
                            ...prevFormData[item],
                            observaciones: e,
                        },
                    });
                }
            });
        }
    };
    const handle_guardar = async (): Promise<void> => {
        try {
            if (formularioSeleccionado === undefined) {
                throw new Error("Seleccione un formulario");
            }
            if (areaSeleccionada === undefined) {
                throw new Error("Seleccione un area");
            }

            const request = {
                action: "add_item_formulario_calidad",
                tipoFormulario: formularioSeleccionado.formulario,
                _id: formularioSeleccionado._id,
                area: areaSeleccionada,
                data: formData,
            };
            const token = await getCredentials();

            const requesOperariosJSON = await fetch(`${url}/calidad/add_item_formulario_calidad`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await requesOperariosJSON.json();
            if (response.status !== 200) { throw new Error(`Code ${response.status}: ${response.message}`); }
            Alert.alert("Se guardó con éxito");
            setFormData(undefined);
            setAreaSeleccionada(undefined);
            setFormularioSeleccionado(undefined);
            setTipoFormulario(undefined);

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("error", err.message);
            }
        }
    };
    return (
        <View style={styles.componentContainer}>
            <Text style={styles.title}>Ingreso Formularios calidad</Text>
            <ScrollView style={styles.formContainer}>
                {loading ? <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
                    :
                    <>
                        <View style={styles.pickerContainer}>
                            <Text>Seleccione el formulario</Text>
                            <Picker
                                selectedValue={formularioSeleccionado?._id || ''}
                                style={styles.picker}
                                onValueChange={(itemValue) => handle_select_formulario(itemValue)}
                            >
                                {formularios && formularios.map(item => (
                                    <Picker.Item
                                        label={`${item.ID} ${item.formulario}`}
                                        value={item._id}
                                        key={item._id}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <HorizontalLine />
                        {formularioSeleccionado && tipoFormulario &&
                            <View style={styles.pickerContainer}>
                                <Text>Seleccionar Áreas</Text>
                                <Picker
                                    selectedValue={areaSeleccionada}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => handle_select_area(itemValue)}
                                >
                                    {formularios && Object.keys(tipoFormulario).map(item => (
                                        <Picker.Item
                                            label={item}
                                            value={item}
                                            key={item}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        }
                        <HorizontalLine />
                        {tipoFormulario && areaSeleccionada &&
                            <View style={styles.pickerContainer}>
                                <Text>Items del formulario</Text>

                                {formData && tipoFormulario[areaSeleccionada].map((item: { key: string, label: string }) => (
                                    <View key={item.key}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                        <View style={styles.formulariosCheckbox}>
                                            <Text style={styles.checkboxText}>{"Cumple"}</Text>
                                            <Switch
                                                value={formData[item.key].status}
                                                onValueChange={(e) => handle_cumple_checkbox(e, item.key)}
                                                style={styles.switch}
                                            />
                                        </View>
                                        <View style={styles.container_observaciones}>
                                            <Text style={styles.checkboxText}>{"Observaciones"}</Text>
                                            <TextInput
                                                style={styles.observaciones_input}
                                                editable
                                                multiline
                                                value={formData[item.key].observaciones}
                                                onChangeText={(e) => handle_observaciones(e, item.key)}
                                            />
                                        </View>
                                    </View>
                                ))}

                            </View>
                        }

                    </>
                }
                <TouchableOpacity
                    style={styles.button}
                    onPress={handle_guardar}
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
        marginBottom: 15,
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
    loader: {
        marginTop: 250,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerContainer: {
        marginBottom: 20,
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
    container_observaciones: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        padding: 10,
        width: '100%',
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    observaciones_input: {
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 15,
        width: '100%',
        marginTop: 15,
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
    itemText:{
        fontWeight:'800',
    },
});
