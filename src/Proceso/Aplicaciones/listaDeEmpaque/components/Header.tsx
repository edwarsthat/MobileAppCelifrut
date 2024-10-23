/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image, View, Button, Text, Modal, Alert } from "react-native";
import { deviceWidth } from "../../../../../App";
import { predioType } from "../../../../../types/predioType";
import {  contenedoresContext, loteSeleccionadoContext } from "../ListaDeEmpaque";

type propsType = {
    setSection: (e: string) => void,
    loteVaciando: predioType[] | undefined
    seleccionarLote: (item: predioType) => void
    setIdContenedor: (data: string) => void;
    cerrarContenendor: () => void
    handleShowResumen: () => void
    showResumen: boolean
}

export default function Header(props: propsType): React.JSX.Element {
    const anchoDevice = useContext(deviceWidth);
    const loteSeleccionado = useContext(loteSeleccionadoContext);
    const contenedores = useContext(contenedoresContext);


    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalPrediosVisible, setModalPrediosVisible] = useState<boolean>(false);
    const [cliente, setCliente] = useState<string>('Contenedores');
    const [lote, setLote] = useState<string>("Lote");


    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
    }, [anchoDevice]);
    const backMainMenu = (): void => {
        props.setSection("menu");
    };

    const handleCerrarContenedor = () => {
        Alert.alert('Cerrar contenedor', `¿Desea cerrar el contenedor?`, [
            {
                text: 'Cancelar',
                onPress: () => console.log("cancelar"),
                style: 'cancel',
            },
            {
                text: 'Aceptar',
                onPress: () => {
                    props.cerrarContenendor();
                },
                style: 'default',
            },
        ]);
    };
    return (
        <SafeAreaView style={isTablet ? stylesTablet.container : styleCel.container}>
            <TouchableOpacity onPress={backMainMenu}>
                <Image
                    source={require('../../../../../assets/CELIFRUT.webp')}
                    style={stylesTablet.image}
                />
            </TouchableOpacity>
            <View style={isTablet ? null : styleCel.viewButtonCerrarContenedor}>
                <Button title="Cerrar Contenedor" onPress={handleCerrarContenedor} />
            </View>

            <Button title={props.showResumen ? 'Lista Empaque' : "Resumen"} onPress={props.handleShowResumen} />

            {/* <View style={isTablet ? null : styleCel.containerPredio}>
                <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>Predio Vaciando:</Text>
                <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>
                    {props.loteVaciando && props.loteVaciando.enf + "-" + props.loteVaciando.nombrePredio}
                </Text>
            </View>

            <View>
                <Image
                    source={
                        props.loteVaciando && props.loteVaciando.tipoFruta === 'Limon'
                            ? require('../../../../../assets/limon.jpg')
                            : require('../../../../../assets/naranja.jpg')
                    }
                    style={isTablet ? stylesTablet.image : styleCel.image}
                />
            </View> */}

            {/*
            <View>
                <Image
                    source={
                        loteSeleccionado.tipoFruta === 'Limon'
                            ? require('../../../../../assets/limon.jpg')
                            : require('../../../../../assets/naranja.jpg')
                    }
                    style={isTablet ? stylesTablet.image : styleCel.image}

                />
            </View> */}

            <TouchableOpacity
                style={isTablet ? stylesTablet.buttonContenedoresPredio : styleCel.buttonContenedores}
                onPress={() => {
                    if (props.loteVaciando && props.loteVaciando.length !== 0) {
                        setModalPrediosVisible(true);
                    }
                }}
            >
                    <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>
                        {lote}
                    </Text>


                    <Image
                        source={
                            loteSeleccionado.tipoFruta === 'Limon'
                                ? require('../../../../../assets/limon.jpg')
                                : require('../../../../../assets/naranja.jpg')
                        }
                        style={isTablet ? stylesTablet.image : styleCel.image}

                    />

            </TouchableOpacity>

            <TouchableOpacity
                style={stylesTablet.buttonContenedores}
                onPress={() => {
                    if (contenedores.length !== 0) {
                        setModalVisible(true);
                    }
                }}
            >
                <Text>{cliente}</Text>
            </TouchableOpacity>


            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={isTablet ? stylesTablet.centerModal : styleCel.centerModal}>
                    <View style={isTablet ? stylesTablet.viewModal : styleCel.viewModal}>
                        <FlatList
                            data={contenedores}
                            style={isTablet ? stylesTablet.pressableStyle : null}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        item.infoContenedor &&
                                            setCliente(
                                                item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE,
                                            );
                                        setModalVisible(false);
                                        item._id ?
                                            props.setIdContenedor(item._id) :
                                            props.setIdContenedor("");
                                    }}>
                                    <Text style={isTablet ? stylesTablet.textList : null}>
                                        {item.infoContenedor && item.numeroContenedor + '-' + item.infoContenedor.clienteInfo.CLIENTE}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            </Modal>


            {/* // predios */}

            <Modal transparent={true} visible={modalPrediosVisible} animationType="fade">
                <View style={isTablet ? stylesTablet.centerModal : styleCel.centerModal}>
                    <View style={isTablet ? stylesTablet.viewModal : styleCel.viewModal}>
                        <FlatList
                            data={props.loteVaciando}
                            style={isTablet ? stylesTablet.pressableStyle : null}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        item._id &&
                                            setLote(
                                                item.enf + '-' + item.nombrePredio,
                                            );
                                        setModalPrediosVisible(false);
                                        item._id ?
                                            props.seleccionarLote(item) :
                                            props.seleccionarLote({
                                                enf: '',
                                                nombrePredio: '',
                                                tipoFruta: '',
                                                _id: '',
                                                predio: '',
                                            });
                                    }}>
                                    <Text style={isTablet ? stylesTablet.textList : null}>
                                        {item.enf && item.enf + '-' + item.nombrePredio}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const stylesTablet = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        top: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        paddingRight: 10,
        elevation: 40,
        shadowColor: '#52006A',
    },
    image: {
        width: 60,
        height: 60,
    },
    buttonContenedores: {
        backgroundColor: 'white',
        width: 150,
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContenedoresPredio: {
        flexDirection:'row',
        backgroundColor: 'white',
        width: 250,
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow:'hidden',
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        marginTop: '6%',
        backgroundColor: 'rgba(0,0,0,0.25',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 350,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
        marginLeft: '65%',
        gap: 50,
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
    predioText: {
        fontSize: 10,
    },
});

const styleCel = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: 'white',
        top: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto',
        paddingRight: 10,
        elevation: 40,
        shadowColor: '#52006A',
        padding: 10,
    },
    image: {
        display: 'none',
    },
    viewButtonCerrarContenedor: {
        display: 'none',
    },
    containerPredio: {
        width: '100%',
        flexDirection:'row',
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        margin: 4,
        borderColor: '#7D9F3A',
    },
    predioText: { fontSize: 12 },
    buttonContenedores: {
        backgroundColor: 'white',
        width: 95,
        height: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        marginTop: '6%',
        backgroundColor: 'rgba(0,0,0,0.25',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 250,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
        gap: 50,
        top: '34%',
        marginLeft: '40%',
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
        fontSize: 10,
    },
});
