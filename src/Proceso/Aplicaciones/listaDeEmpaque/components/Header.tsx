import React, { useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image, View, Button, Text, Modal, Alert } from "react-native";
import { predioType } from "../../../../../types/predioType";
import { contenedoresType } from "../../../../../types/contenedoresType";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { useAppStore } from "../../../../stores/useAppStore";
import { useSocketStore } from "../../../../stores/useSocketStore";
import { obtenerAccessToken } from "../../../../utils/auth";

type propsType = {
    setSection: (e: string) => void,
    isTablet: boolean
    contenedores: contenedoresType[]
    loteVaciando: predioType[] | undefined
    showResumen: boolean,
    cerrarContenendor: () => void
    handleShowResumen: () => void
    enviarCajasCuartoFrio: (cuartoFrio: any, idsItems: string[]) => Promise<void>;
}

export default function Header({
    contenedores, setSection, isTablet, loteVaciando, showResumen, cerrarContenendor, handleShowResumen, enviarCajasCuartoFrio,
}: propsType): React.JSX.Element {

    const setLoading = useAppStore(state => state.setLoading);
    const loading = useAppStore(state => state.loading);
    const contenedor = useListaDeEmpaqueStore((state) => state.contenedor);
    const seleccionarContenedor = useListaDeEmpaqueStore((state) => state.seleccionarContenedor);
    const loteSeleccionado = useListaDeEmpaqueStore((state) => state.loteSeleccionado);
    const seleccionarLote = useListaDeEmpaqueStore((state) => state.seleccionarLote);
    const socketRequest = useSocketStore(state => state.sendRequest);
    const cuartosFrios = useListaDeEmpaqueStore(state => state.cuartosFrios);
    const EF1_id = useListaDeEmpaqueStore(state => state.EF1_id);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalPrediosVisible, setModalPrediosVisible] = useState<boolean>(false);
    const [modalCuartosFriosVisible, setModalCuartosFriosVisible] = useState<boolean>(false);

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
    const handleAddPallet = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();

            const request = {
                data: {
                    action: "put_proceso_add_pallet_listaempaque",
                    _id: contenedor?._id,
                },
                token: token,

            };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error("No se pudo agregar el pallet. Intente nuevamente.");
            }
            Alert.alert("Éxito", "Pallet agregado correctamente.");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error adding pallet:", error);
                Alert.alert("Error", error.message);
            }
        } finally {
            setLoading(false);
        }
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
                        <Button title="Enviar Cuartos Frios" onPress={() => setModalCuartosFriosVisible(true)} color="#7D9F3A" />
                        <Button disabled={loading} title="Agregar pallet" color="#7D9F3A" onPress={handleAddPallet} />
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
                                loteSeleccionado && loteSeleccionado.tipoFruta.tipoFruta === 'Limon'
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
                            keyExtractor={(item, idx) => item._id + idx }
                        />
                    </View>
                </View>
            </Modal>

            <Modal transparent={true} visible={modalCuartosFriosVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={cuartosFrios}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                    ]}
                                    onPress={async () => {
                                        setModalCuartosFriosVisible(false);
                                        await enviarCajasCuartoFrio(item, EF1_id);
                                    }}
                                >
                                    <View style={styles.buttonTextPredio}>
                                        <Text style={styles.buttonText}>
                                            {`${item.nombre}`}
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                        />
                        <TouchableOpacity style={[styles.selectionButton]} onPress={() => setModalCuartosFriosVisible(false)}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
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
    selectedBorder: {
        borderColor: '#F9B900',
        borderWidth: 2,
    },
});
