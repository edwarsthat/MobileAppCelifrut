import { Alert, FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { EF1Item } from "../types";
import { useAppStore } from "../../../../stores/useAppStore";
import { obtenerAccessToken } from "../../../../utils/auth";
import { CuartoFrioType } from "../../../../../types/cuartosFrios";
import { useSocketStore } from "../../../../stores/useSocketStore";
import FormInput from "../../../../UI/components/FormInput";

type propsType = {
    cuarto: CuartoFrioType;
    onBack: () => void;
}

export default function DetallerCuartoFrio({ cuarto, onBack }: propsType): React.JSX.Element {
    const setLoading = useAppStore((state) => state.setLoading);
    const socketRequest = useSocketStore(state => state.sendRequest);

    const [data, setData] = useState<EF1Item[]>([]);
    const [dataOriginal, setDataOriginal] = useState<EF1Item[]>([]);
    const [filtros, setFiltros] = useState<{ contenedor: string, pallet: string }>({ contenedor: "", pallet: "" });
    const [totalData, setTotalData] = useState<{ cajas: number, kilos: number }>({ cajas: 0, kilos: 0 });

    useEffect(() => {
        obtenerDetallesCuarto();
    }, [cuarto]);
    useEffect(() => {
        let datosFiltrados = [...dataOriginal];
        if (filtros.contenedor.trim() !== '') {
            datosFiltrados = datosFiltrados.filter(item => String(item.contenedor).toLowerCase().includes(filtros.contenedor.toLowerCase()));
        }
        if (filtros.pallet.trim() !== '') {
            datosFiltrados = datosFiltrados.filter(item => (item.pallet + 1).toString().includes(filtros.pallet));
        }

        totalesDestaller(datosFiltrados);
        setData(datosFiltrados);
    }, [filtros]);

    const obtenerDetallesCuarto = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_inventarios_cuartosFrios_detalles', data: cuarto }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(response.message || "Error en la solicitud");
            }
            setDataOriginal(response.data || []);
            setData(response.data || []);
            totalesDestaller(response.data || []);

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Error", error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const totalesDestaller = (dataList: EF1Item[]): void => {
        const totales = { kilos: 0, cajas: 0 };
        (dataList ?? []).forEach((cuartos: EF1Item) => {
            const { cajas, tipoCaja } = cuartos;
            const mult = tipoCaja.split("-")[1] ? parseFloat(tipoCaja.split("-")[1].trim()) : 1;
            totales.kilos += (cajas ?? 0) * mult;
            totales.cajas += (cajas ?? 0);
        });
        setTotalData(totales);
    };
    return (
        <View style={styles.container}>
            {/* Header con botón de regreso */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Detalles del Cuarto</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Información del cuarto */}
            <View style={styles.cuartoInfo}>
                <Text style={styles.cuartoName}>{cuarto.nombre}</Text>
                <Text style={styles.itemCount}>
                    {data.length} {data.length === 1 ? 'elemento' : 'elementos'}
                </Text>
            </View>

            {/* Totales del cuarto */}
            <View style={styles.totalsContainer}>
                <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Total Cajas:</Text>
                    <Text style={styles.totalValue}>{totalData.cajas}</Text>
                </View>
                <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Total Kilos:</Text>
                    <Text style={styles.totalValue}>{totalData.kilos}</Text>
                </View>
            </View>

            {/* Filtros */}
            <View style={styles.filtersContainer}>
                <View style={styles.filterInputContainer}>
                    <FormInput
                        label="Contenedor"
                        value={String(filtros.contenedor || '')}
                        onChangeText={(value): void => setFiltros({ ...filtros, contenedor: value})}
                        placeholder="N. de contenedor"
                        type="numeric"
                    />
                </View>
                <View style={styles.filterInputContainer}>
                    <FormInput
                        label="Pallet"
                        value={String(filtros.pallet || '')}
                        onChangeText={(value): void => setFiltros({ ...filtros, pallet: value })}
                        placeholder="N. de pallet"
                        type="numeric"
                    />
                </View>
            </View>

            {data.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay datos disponibles</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    {/* Header de la tabla */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Contenedor</Text>
                        <Text style={styles.tableHeaderText}>Pallet</Text>
                        <Text style={styles.tableHeaderText}>Predio</Text>
                        <Text style={styles.tableHeaderText}>ENF</Text>
                        <Text style={styles.tableHeaderText}>Tipo Caja</Text>
                        <Text style={styles.tableHeaderText}>Cajas</Text>
                    </View>

                    {/* FlatList optimizado para listas grandes */}
                    <FlatList
                        data={data}
                        style={styles.flatList}
                        renderItem={({ item, index }) => (
                            <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                                <Text style={styles.tableCell}>{item.contenedor}</Text>
                                <Text style={styles.tableCell}>{item.pallet + 1}</Text>
                                <Text style={styles.tableCell}>{item.lote.predio}</Text>
                                <Text style={styles.tableCell}>{item.lote.enf}</Text>
                                <Text style={styles.tableCell}>{item.tipoCaja}</Text>
                                <Text style={[styles.tableCell, styles.numericCell]}>{item.cajas}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item._id.toString()}
                        showsVerticalScrollIndicator={true}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={50}
                        updateCellsBatchingPeriod={30}
                        initialNumToRender={20}
                        windowSize={10}
                        getItemLayout={(_, index) => ({
                            length: 42, // altura estimada de cada item (reducida)
                            offset: 42 * index,
                            index,
                        })}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#3498db',
        borderRadius: 6,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    screenTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 70,
    },
    cuartoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 4,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cuartoName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
    },
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalItem: {
        alignItems: 'center',
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 2,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    filtersContainer: {
        marginHorizontal: 16,
        marginVertical: 6,
        gap: 8,
    },
    filterInputContainer: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#3498db',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
    },
    itemCount: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '500',
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        marginHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#95a5a6',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#34495e',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 6,
        marginBottom: 4,
    },
    tableHeaderText: {
        flex: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 11,
        textAlign: 'center',
    },
    flatList: {
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 4,
        marginBottom: 2,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        minHeight: 40,
    },
    evenRow: {
        backgroundColor: '#ffffff',
    },
    oddRow: {
        backgroundColor: '#f8f9fa',
    },
    tableCell: {
        flex: 1,
        fontSize: 12,
        color: '#2c3e50',
        textAlign: 'center',
        paddingHorizontal: 2,
    },
    numericCell: {
        fontWeight: 'bold',
        color: '#27ae60',
    },
});
