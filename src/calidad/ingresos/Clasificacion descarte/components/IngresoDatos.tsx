import React, { useState } from "react";
import { dataDefectos } from "../functions/data";
import { elementoDefectoType, LabelsTypes } from "../types/clasificacionTypes";
import { View, TouchableOpacity, Text, StyleSheet, Alert, FlatList, Modal, TextInput, Button } from "react-native";

type propsType = {
    setDataArray: React.Dispatch<React.SetStateAction<elementoDefectoType[]>>
}

export default function IngresoDatos(props: propsType): React.JSX.Element {
    const [defecto, setDefecto] = useState<string>('');
    const [lavado, setLavado] = useState<string>('');
    const [encerado, setEncerado] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const handleAgregar = (): void => {
        const newElement = {
            defecto: defecto,
            lavado: Number(lavado),
            encerado: Number(encerado),
        };
        props.setDataArray(prev => {
            const newArray = [...prev];
            newArray.push(newElement);
            return newArray;
        });
        setLavado('');
        setEncerado('');
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.botonLotes}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>
                    {defecto ? dataDefectos[defecto as keyof LabelsTypes] : 'Seleccione Defecto'}
                </Text>
            </TouchableOpacity>

            <TextInput
                style={styles.inputs}
                placeholder="Lavado"
                inputMode="numeric"
                value={lavado}
                onChangeText={setLavado}
            />

            <TextInput
                style={styles.inputs}
                value={encerado}
                placeholder="Encerado"
                inputMode="numeric"
                onChangeText={setEncerado}
            />

            {/* Botón nativo de RN (poco personalizable) */}
            <View style={styles.buttonContainer}>
                <Button title="Agregar" onPress={handleAgregar} />
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.viewModal}>
                        <FlatList
                            data={Object.keys(dataDefectos)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pressableStyle}
                                    onPress={() => {
                                        setDefecto(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.textList}>
                                        {dataDefectos[item as keyof LabelsTypes]}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    /* Contenedor principal */
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Fondo claro para más comodidad visual
        paddingTop: 20,
        alignItems: 'center',
    },

    /* Botón para seleccionar defecto/predio */
    botonLotes: {
        width: 250,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        // Pequeña sombra (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        // Sombra (Android)
        elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },

    /* Estilos para los TextInput */
    inputs: {
        width: 250,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD', // Más claro que #7D9F3A para que el contorno no sea tan dominante
        marginVertical: 6,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
        // Sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        elevation: 1,
    },

    /* Botón contenedor */
    buttonContainer: {
        marginTop: 12,
    },

    /* Fondo semitransparente para el modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Contenedor interno del Modal */
    viewModal: {
        backgroundColor: '#FFFFFF',
        width: '85%',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        // Sombra en iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // Sombra en Android
        elevation: 4,
    },

    /* Estilo para cada opción en la lista del modal */
    pressableStyle: {
        marginVertical: 10,
    },
    textList: {
        color: '#333',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 15,
    },
});
