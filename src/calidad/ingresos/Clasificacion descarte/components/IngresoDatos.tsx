/* eslint-disable prettier/prettier */
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
            <TouchableOpacity style={styles.botonLotes}
                onPress={() => setModalVisible(true)}>
                <Text>{defecto ? dataDefectos[defecto as keyof LabelsTypes] : 'Seleccione Defecto'}</Text>
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
            <Button title="Agregar" onPress={handleAgregar} />
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centerModal}>
                    <View style={styles.viewModal}>

                        <FlatList
                            data={Object.keys(dataDefectos)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pressableStyle}
                                    onPress={() => {
                                        setDefecto(item);
                                        setModalVisible(false);
                                    }}>
                                    <Text style={styles.textList}>{dataDefectos[item as keyof LabelsTypes]}</Text>
                                </TouchableOpacity>)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    botonLotes: {
        backgroundColor: 'white',
        width: 250,
        height: 50,
        marginLeft: '5%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        marginTop: '18%',
    },
    viewModal: {
        backgroundColor: 'white',
        width: '90%',
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
    },
    pressableStyle: {
        marginTop: 10,
        marginBottom: 10,
    },
    textList: {
        color: 'black',
        marginLeft: 10,
        marginRight: 15,
        fontSize: 18,
    },
    inputs: {
        backgroundColor: 'white',
        width: 250,
        height: 50,
        marginLeft: '5%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
