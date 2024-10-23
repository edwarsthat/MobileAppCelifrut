/* eslint-disable prettier/prettier */
import React, { useContext, useState } from "react";
import { Modal,Button, FlatList, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { contenedoresContext, contenedorSeleccionadoContext } from "../ListaDeEmpaque";
import { contenedoresType } from "../../../../../types/contenedoresType";

type propsType = {
    openModalEditar: boolean
    setOpenModalEditar: (e:boolean) => void
    modificarItems: (item:any) => void
}
export default function ModalModificarItem(props: propsType): React.JSX.Element {
    const idContenedor = useContext(contenedorSeleccionadoContext);
    const contenedor: contenedoresType | undefined = useContext(contenedoresContext,)
        .find(item => item._id === idContenedor);

    const [modalCalidad, setModalCalidad] = useState<boolean>(false);
    const [modalCalibre, setModalCalibre] = useState<boolean>(false);
    const [modalTipoCaja, setModalTipoCaja] = useState<boolean>(false);

    const [calidad, setCalidad] = useState<string>('Calidad');
    const [calibre, setCalibre] = useState<string>('Calibre');
    const [tipoCaja, setTipoCaja] = useState<string>('Tipo de caja');
    const handleCalidad = () => {
        setModalCalidad(true);
    };
    const handleCalibre = () => {
        setModalCalibre(true);
    };
    const handleTipoCaja = () => {
        setModalTipoCaja(true);
    };
    const handleModificar = () => {
        if(calibre === 'Calibre' || calidad === 'Calidad' || tipoCaja === 'Tipo de caja'){
            return Alert.alert("Error, seleccione el calibre y la calidad");
        }
        const data = {
            calidad:calidad,
            calibre:calibre,
            tipoCaja: tipoCaja,
        };
        props.modificarItems(data);
        props.setOpenModalEditar(false);
        setCalibre('Calibre');
        setCalidad('Calidad');
        setTipoCaja('Tipo de caja');
    };
    return (
        <>
            <Modal transparent={true} visible={props.openModalEditar} animationType="fade">
                <View style={styles.centerModal}>
                    <View style={styles.viewModalItem}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.textModalHeader}>
                                Editar elementos
                            </Text>
                        </View>
                        <View style={styles.viewButtons}>
                            <TouchableOpacity
                                onPress={handleCalidad}
                                style={styles.buttonContenedores}>
                                <Text>{calidad}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCalibre}
                                style={styles.buttonContenedores}>
                                <Text>{calibre}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleTipoCaja}
                                style={styles.buttonContenedores}>
                                <Text>{tipoCaja}</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.viewButtonsModal}>
                            <Button title="Editar" onPress={handleModificar}/>
                            <Button title="Cancelar" onPress={() => props.setOpenModalEditar(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* //opciones calidad */}
            <Modal transparent={true} visible={modalCalidad} animationType="fade">
                <View style={styles.centerModal}>
                    <View style={styles.viewModalItem}>
                        <FlatList
                            data={contenedor?.infoContenedor.calidad}
                            style={styles.pressableStyle}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.buttonContenedores}
                                    onPress={() => {
                                        setModalCalidad(false);
                                        setCalidad(item);
                                    }}>
                                    <Text style={styles.textList}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item}
                        />
                    </View>
                </View>
            </Modal>
            {/* opciones calibre */}
            <Modal transparent={true} visible={modalCalibre} animationType="fade">
                <View style={styles.centerModal}>
                    <View style={styles.viewModalItem}>
                        <FlatList
                            data={contenedor?.infoContenedor.calibres}
                            style={styles.pressableStyle}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.buttonContenedores}
                                    onPress={() => {
                                        setModalCalibre(false);
                                        setCalibre(item);
                                    }}>
                                    <Text style={styles.textList}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item}
                        />
                    </View>
                </View>
            </Modal>
            {/* opciones tipo de caja */}
            <Modal transparent={true} visible={modalTipoCaja} animationType="fade">
                <View style={styles.centerModal}>
                    <View style={styles.viewModalItem}>
                        <FlatList
                            data={contenedor?.infoContenedor.tipoCaja}
                            style={styles.pressableStyle}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.buttonContenedores}
                                    onPress={() => {
                                        setModalTipoCaja(false);
                                        setTipoCaja(item);
                                    }}>
                                    <Text style={styles.textList}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    centerModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
    },
    viewModalItem: {
        width: 500,
        height: 350,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 30,
        shadowColor: 'black',
        padding: 10,
        alignItems: 'center',
    },
    viewModalItems: {
        width: 500,
        height: 350,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 30,
        shadowColor: 'black',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        padding: 10,
    },
    textModalHeader: {
        fontSize: 18,
        fontWeight: '500',
    },
    buttonContenedores: {
        width: 350,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#7D9F3A',
        backgroundColor: '#F5F5F5',
        height: 50,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressableStyle: {
        marginTop: 10,
        marginBottom: 10,
    },
    textList: {
        color: 'black',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        fontSize: 20,
    },
    viewButtons: {
        display: 'flex',
        gap: 25,
    },
    viewButtonsModal: {
        display: 'flex',
        flexDirection: 'row',
        gap: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
      },
});
