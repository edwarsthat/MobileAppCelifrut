import React, { useContext, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image, View, Button, Text, Modal, Alert } from "react-native";
// import { deviceWidth } from "../../../../../App";
import { predioType } from "../../../../../types/predioType";
import { contenedoresContext, loteSeleccionadoContext } from "../ListaDeEmpaque";

type propsType = {
    setSection: (e: string) => void,
    loteVaciando: predioType[] | undefined
    seleccionarLote: (item: predioType) => void
    setIdContenedor: (data: string) => void;
    cerrarContenendor: () => void
    handleShowResumen: () => void
    showResumen: boolean,
    setPalletSeleccionado: (e: number) => void
    isTablet: boolean
}

export default function Header(props: propsType): React.JSX.Element {
    // const anchoDevice = useContext(deviceWidth);
    const loteSeleccionado = useContext(loteSeleccionadoContext);
    const contenedores = useContext(contenedoresContext);


    // const [isTablet, setIsTablet] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalPrediosVisible, setModalPrediosVisible] = useState<boolean>(false);
    const [cliente, setCliente] = useState<string>('Contenedores');
    const [lote, setLote] = useState<string>("Lote");


    // useEffect(() => {
    //     setIsTablet(anchoDevice >= 721);
    // }, [anchoDevice]);
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
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={backMainMenu}>
                <Image
                    source={require('../../../../../assets/logo_app.png')}
                    style={styles.logo}
                />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <Button title="Cerrar Contenedor" onPress={handleCerrarContenedor} color="#7D9F3A" />

                {props.isTablet &&
                    <Button
                        title={props.showResumen ? "Lista Empaque" : "Resumen"}
                        onPress={props.handleShowResumen}
                        color="#7D9F3A"
                    />
                }

            </View>


            {props.isTablet &&
                <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={() => {
                        if (props.loteVaciando && props.loteVaciando.length !== 0) {
                            setModalPrediosVisible(true);
                        }
                    }}
                >
                    <View style={styles.buttonTextPredio}>
                        <Text style={styles.buttonText}>
                            {lote}
                        </Text>


                        <Image
                            source={
                                loteSeleccionado.tipoFruta === 'Limon'
                                    ? require('../../../../../assets/limon.jpg')
                                    : require('../../../../../assets/naranja.jpg')
                            }
                            style={styles.logo}
                        />
                    </View>


                </TouchableOpacity>
            }
            <TouchableOpacity
                style={styles.selectionButton}
                onPress={() => {
                    if (contenedores.length !== 0) { setModalVisible(true); }
                }}
            >
                <Text style={styles.buttonText}>{cliente}</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={contenedores}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item.infoContenedor) {
                                            setCliente(`${item.numeroContenedor} - ${item.infoContenedor.clienteInfo.CLIENTE}`);
                                            props.setIdContenedor(item._id || "");
                                        }
                                        props.setPalletSeleccionado(-1);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.listItemText}>
                                        {item.numeroContenedor} - {item.infoContenedor?.clienteInfo.CLIENTE}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    </View>
                </View>
            </Modal>


            {/* // predios */}

            <Modal transparent={true} visible={modalPrediosVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={props.loteVaciando}
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
                                    <Text style={styles.listItemText}>
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

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        height: 80,
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    selectionButton: {
        backgroundColor: "#F1F8E9",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#7D9F3A",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#4C7300",
        fontSize: 12,
        fontWeight: "600",
    },
    buttonTextPredio: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    listItemText: {
        fontSize: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
});

