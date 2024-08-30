/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image, View, Button, Text, Modal, Alert } from "react-native";
import { deviceWidth } from "../../../../../App";
import { predioType } from "../../../../../types/predioType";
import { contenedorSeleccionadoContext, contenedoresContext, loteSeleccionadoContext } from "../ListaDeEmpaque";

type propsType = {
    setSection: (e: string) => void,
    loteVaciando: predioType | undefined
    seleccionarLote: (item: predioType) => void
    setNumeroContenedor: (data: number) => void;
    cerrarContenendor: () => void
}

export default function Header(props: propsType): React.JSX.Element {
    const anchoDevice = useContext(deviceWidth);
    const loteSeleccionado = useContext(loteSeleccionadoContext);
    const contenedores = useContext(contenedoresContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const contenedor = contenedores.find(item => item.numeroContenedor === numeroContenedor);


    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [cliente, setCliente] = useState<string>('Contenedores');


    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
    }, [anchoDevice]);
    const backMainMenu = (): void => {
        props.setSection("menu");
    };
    const obtenerLoteInfo = () => {
        if (props.loteVaciando) { props.seleccionarLote(props.loteVaciando); }
    };
    const handleCerrarContenedor = () => {
        Alert.alert('Cerrar contenedor', `¿Desea cerrar el contenedor ${numeroContenedor}?`, [
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

            <View style={isTablet ? null : styleCel.containerPredio}>
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
            </View>
            <View style={isTablet ? null : styleCel.containerPredio}>
                <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>Predio Actual:</Text>
                <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>{loteSeleccionado.enf + "-" + loteSeleccionado.nombrePredio}</Text>
            </View>

            <View>
                <Image
                    source={
                        loteSeleccionado.tipoFruta === 'Limon'
                            ? require('../../../../../assets/limon.jpg')
                            : require('../../../../../assets/naranja.jpg')
                    }
                    style={isTablet ? stylesTablet.image : styleCel.image}

                />
            </View>

            {
                <View>
                    <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>Cajas Total:</Text>
                    <Text style={isTablet ? stylesTablet.predioText : styleCel.predioText}>
                        {contenedor &&
                            contenedor.pallets.reduce(
                                (acu, pallet) => acu + pallet.EF1.reduce((acu2, lote) => acu2 + lote.cajas, 0),
                                0,
                            )}
                    </Text>
                </View>
            }


            <TouchableOpacity
                style={isTablet ? stylesTablet.buttonContenedores : styleCel.buttonContenedores}
                onPress={obtenerLoteInfo}>
                <Text>Obtener Lote</Text>
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
                                        item.numeroContenedor ?
                                            props.setNumeroContenedor(item.numeroContenedor) :
                                            props.setNumeroContenedor(-1);
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
    predioText:{
        fontSize:10,
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
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        margin: 4,
        borderColor: '#7D9F3A',
    },
    predioText:{fontSize:12},
    buttonContenedores: {
        backgroundColor: 'white',
        width: 95,
        height: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize:12,
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
