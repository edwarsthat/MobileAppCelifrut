import { Alert, FlatList, Modal, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { useAppStore } from "../../../stores/useAppStore";
import { obtenerAccessToken } from "../../../utils/auth";
import { useSocketStore } from "../../../stores/useSocketStore";
import { CuartoFrioType } from "../../../../types/cuartosFrios";
import HorizontalLine from "../../../components/HorizontalLine";
import DetallerCuartoFrio from "./components/DetallerCuartoFrio";

export default function CuartosFrios(): React.JSX.Element {
    const { anchoDevice } = useAppContext();
    const setLoading = useAppStore((state) => state.setLoading);
    const socketRequest = useSocketStore(state => state.sendRequest);
    const [isTablet, setIsTablet] = useState(anchoDevice >= 721);
    const [data, setData] = useState<CuartoFrioType[]>([]);
    const [totalData, setTotalData] = useState<{ cajas: number, kilos: number }>({ cajas: 0, kilos: 0 });

    const [selectedCuarto, setSelectedCuarto] = useState<CuartoFrioType | null>(null);
    const [modalCuartosFrios, setModalCuartosFrios] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setIsTablet(anchoDevice >= 721);
                await obtenerData();
            } catch (error) {
                console.log(error);
                Alert.alert('Error', 'No se pudieron obtener los datos iniciales');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [anchoDevice]);
    const obtenerData = async () => {
        try {
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_inventarios_cuartosFrios' }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                Alert.alert('Error', 'No se pudieron obtener los datos');
            }

            const arr: CuartoFrioType[] = response.data || [];
            setData(arr);
            const totales = { kilos: 0, cajas: 0 };

            (arr ?? []).forEach((cuarto: CuartoFrioType) => {
                Object.values(cuarto?.totalFruta ?? {}).forEach(cantidades => {
                    totales.kilos += cantidades?.kilos ?? 0;
                    totales.cajas += cantidades?.cajas ?? 0;
                });
            });
            setTotalData(totales);
            console.log(arr);
            return arr;

        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudieron obtener los datos');
        }
    };
    const handleSelectCuarto = (cuarto: CuartoFrioType) => {
        setSelectedCuarto(cuarto);
        setModalCuartosFrios(false);
    };

    return (
        <View style={styles.mainContainer}>
            {selectedCuarto ? (
                // Vista de detalles del cuarto seleccionado
                <DetallerCuartoFrio
                    cuarto={selectedCuarto}
                    onBack={() => setSelectedCuarto(null)}
                />
            ) : (
                // Vista principal con ScrollView
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Inventario Cuartos Fríos</Text>
                    <HorizontalLine />

                    <View style={styles.selectorContainer}>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setModalCuartosFrios(true)}
                        >
                            <Text style={styles.selectorButtonText}>
                                Seleccionar Cuarto Frío
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.totalsContainer, isTablet && styles.totalsContainerTablet]}>
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Total General Cajas:</Text>
                            <Text style={styles.totalValue}>{totalData.cajas}</Text>
                        </View>
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Total General Kilos:</Text>
                            <Text style={styles.totalValue}>{totalData.kilos}</Text>
                        </View>
                    </View>

                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>
                            Selecciona un cuarto frío para ver sus detalles y aplicar filtros específicos
                        </Text>
                    </View>
                </ScrollView>
            )}

            <Modal transparent={true} visible={modalCuartosFrios} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Cuarto Frío</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalCuartosFrios(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={data}
                            style={styles.modalList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalListItem}
                                    onPress={() => handleSelectCuarto(item)}
                                >
                                    <Text style={styles.modalListItemText}>{item?.nombre}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString() + item._id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 8,
    },
    selectorContainer: {
        marginVertical: 16,
    },
    selectorButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectorButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        marginVertical: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalsContainerTablet: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    totalItem: {
        alignItems: 'center',
        flex: 1,
    },
    totalLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    filtersContainer: {
        marginVertical: 16,
        gap: 12,
    },
    filterInputContainer: {
        width: '100%',
    },
    instructionContainer: {
        backgroundColor: '#e8f4fd',
        padding: 16,
        borderRadius: 12,
        marginVertical: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
    },
    instructionText: {
        fontSize: 14,
        color: '#2c3e50',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    detailsContainer: {
        marginTop: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 200,
        maxHeight: 500,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        margin: 20,
        maxHeight: '80%',
        width: '90%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalContentTablet: {
        width: '60%',
        maxWidth: 600,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalList: {
        maxHeight: 400,
    },
    modalListItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        backgroundColor: '#ffffff',
    },
    modalListItemText: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
    },
});
