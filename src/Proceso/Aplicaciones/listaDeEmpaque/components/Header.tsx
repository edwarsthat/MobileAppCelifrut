import React, { useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image, View, Button, Text, Modal, Alert } from "react-native";
import { predioType } from "../../../../../types/predioType";
import { cuartosFriosType } from "../../../../../types/catalogs";
import { contenedoresType } from "../../../../../types/contenedoresType";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";

type propsType = {
    cuartosFrios: cuartosFriosType[];
    setSection: (e: string) => void,
    isTablet: boolean
    contenedores: contenedoresType[]
    loteVaciando: predioType[] | undefined
    showResumen: boolean,
    cerrarContenendor: () => void
    handleShowResumen: () => void
}

export default function Header({
    contenedores, setSection, isTablet, loteVaciando, showResumen, cerrarContenendor, handleShowResumen,
}: propsType): React.JSX.Element {

    const contenedor = useListaDeEmpaqueStore((state) => state.contenedor);
    const seleccionarContenedor = useListaDeEmpaqueStore((state) => state.seleccionarContenedor);
    const loteSeleccionado = useListaDeEmpaqueStore((state) => state.loteSeleccionado);
    const seleccionarLote = useListaDeEmpaqueStore((state) => state.seleccionarLote);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalPrediosVisible, setModalPrediosVisible] = useState<boolean>(false);
    // const [modalCuartosFriosVisible, setModalCuartosFriosVisible] = useState<boolean>(false);

    const backMainMenu = (): void => {
        setSection("menu");
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
                    cerrarContenendor();
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

                {isTablet &&
                    <>
                        <Button
                            title={showResumen ? "Lista Empaque" : "Resumen"}
                            onPress={handleShowResumen}
                            color="#7D9F3A"
                        />
                        {/* <Button title="Enviar Cuartos Frios" onPress={() => setModalCuartosFriosVisible(true)} color="#7D9F3A" /> */}
                        {/* <Button title="Agregar pallet" color="#7D9F3A" /> */}
                    </>

                }
            </View>
            {isTablet &&
                <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={() => {
                        if (loteVaciando && loteVaciando.length !== 0) {
                            setModalPrediosVisible(true);
                        }
                    }}
                >
                    <View style={styles.buttonTextPredio}>
                        <Text style={styles.buttonText}>
                            {loteSeleccionado && loteSeleccionado.enf + "-" + loteSeleccionado.nombrePredio}
                        </Text>
                        <Image
                            source={
                                loteSeleccionado && loteSeleccionado.tipoFruta === 'Limon'
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
                <Text style={styles.buttonText}>{contenedor ? `${contenedor.numeroContenedor} - ${contenedor.infoContenedor?.clienteInfo.CLIENTE}` : "Seleccionar"}</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={contenedores}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        (contenedor?._id === item._id || loteSeleccionado?._id === item._id) && styles.selectedBorder,
                                    ]}
                                    onPress={() => {
                                        seleccionarContenedor(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        {`${item.numeroContenedor} - ${item.infoContenedor?.clienteInfo.CLIENTE}`}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    </View>
                </View>
            </Modal>

            <Modal transparent={true} visible={modalPrediosVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={loteVaciando}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        (contenedor?._id === item._id || loteSeleccionado?._id === item._id) && styles.selectedBorder,
                                    ]}
                                    onPress={() => {
                                        seleccionarLote(item);
                                        setModalPrediosVisible(false);
                                    }}
                                >
                                    <View style={styles.buttonTextPredio}>
                                        <Text style={styles.buttonText}>
                                            {`${item.enf} - ${item.nombrePredio}`}
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            </Modal>

            {/* <Modal transparent={true} visible={modalCuartosFriosVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={props.cuartosFrios}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        (idContenedor === item._id || loteSeleccionado?._id === item._id) && styles.selectedBorder,
                                    ]}
                                    onPress={async () => {
                                        setModalCuartosFriosVisible(false);
                                        // await props.eviarPalletCuartoFrio(item);
                                    }}
                                >
                                    <View style={styles.buttonTextPredio}>
                                        <Text style={styles.buttonText}>
                                            {`${item.nombre}`}
                                        </Text> */}
            {/* ... */}
            {/* </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            </Modal> */}


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
    selectedBorder: {
        borderColor: '#F9B900',
        borderWidth: 2,
    },
});
