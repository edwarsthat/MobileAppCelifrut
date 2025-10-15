import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { deviceWidth } from "../../../../../App";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { itemPalletType } from "../../../../../types/contenedores/itemsPallet";
import { palletsType } from "../../../../../types/contenedores/palletsType";

type propsType = {
    setSeleccion: (data: string[]) => void;
    itemsPallet: itemPalletType[];
    pallets: palletsType[];
};

export default function Informacion(props: propsType): React.JSX.Element {
    const anchoDevice = useContext(deviceWidth);
    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const pallet = useListaDeEmpaqueStore(state => state.pallet);
    const seleccion = useListaDeEmpaqueStore(state => state.seleccion);
    const setEF1_id = useListaDeEmpaqueStore(state => state.setEF1_id);
    const EF1_id = useListaDeEmpaqueStore(state => state.EF1_id);
    const inventarioCuartoFrio = useListaDeEmpaqueStore(state => state.cuartosFriosInventario);

    const [isTablet, setIsTablet] = useState<boolean>(false);
    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
    }, [anchoDevice]);

    const handleSeleccion = (index: string) => {
        if (seleccion.includes(index)) {
            const indice = seleccion.findIndex(i => i === index);
            let numerosAnteriores = [...seleccion];
            numerosAnteriores.splice(indice, 1);
            props.setSeleccion(numerosAnteriores);

        } else {
            let numerosAnteriores = [...seleccion];
            numerosAnteriores.push(index);
            props.setSeleccion(numerosAnteriores);
        }
    };
    const isInCuartoFrio = (item: any) => {
        return inventarioCuartoFrio.includes(item._id);
    };
    const palletId = props.pallets.find(p => p.numeroPallet === pallet);
    if (!palletId) {
        return (
            <View style={styles.scrollStyle}>
                <Text >Seleccione un pallet para ver su información</Text>
            </View>
        );
    }
    return (
        <>
            <View style={styles.scrollStyle}>
                {contenedor && pallet !== null && props.itemsPallet.length > 0 &&
                    <FlatList
                        data={props.itemsPallet.filter(item => item.pallet._id === palletId._id)}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item, index }) => (
                            <View style={styles.container}>
                                <View style={styles.containerHeader}>
                                    <View key={index + 'view2'}>
                                        <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item?.lote?.enf || 'N/A'}</Text>
                                    </View>
                                    <View >
                                        <View style={styles.view3} key={index + 'view4'}>
                                            <Text key={index + 'nombrPredioHeader'} style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>
                                                Nombre Predio:{' '}
                                            </Text>
                                            <Text key={index + 'nombrPredio'} style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>
                                                {item?.lote?.predio?.PREDIO || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    disabled={isInCuartoFrio(item)}
                                    style={
                                        isInCuartoFrio(item)
                                            ? (isTablet ? styles.touchableCold : stylesCel.touchableCold)
                                            : isTablet
                                                ? (seleccion.includes(item._id) ? styles.touchablePress : styles.touchable)
                                                : (seleccion.includes(item._id) ? stylesCel.touchablePress : stylesCel.touchable)
                                    }
                                    onPress={() => {
                                        handleSeleccion(item._id);
                                        setEF1_id(
                                            EF1_id.includes(item._id)
                                                ? EF1_id.filter(id => id !== item._id)
                                                : [...EF1_id, item._id]
                                        );
                                    }}>
                                    <View style={styles.view3}>
                                        <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{'No. Cajas:'} </Text>
                                        <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.cajas}</Text>
                                    </View>
                                    <View style={isTablet ? styles.view4 : stylesCel.view4}>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>{'Tipo Caja:'} </Text>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>{item.tipoCaja}</Text>
                                        </View>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>Calibre: </Text>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>
                                                {item.calibre}
                                            </Text>
                                        </View>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>Calidad: </Text>
                                            <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>
                                                {item.calidad.nombre || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollStyle: {
        backgroundColor: '#FFE6FF',
        padding: 12,
        borderRadius: 16,
        // sombra tipo card coherente con Footer
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        flex: 1,
        width: "100%",
        // Márgenes para centrar un poco más la card
        marginTop: 12,
        marginRight: 12,
    },
    listContent: {
        paddingBottom: 12,
    },
    container: {
        marginBottom: 12,
    },
    containerHeader: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        paddingBottom: 8,
        marginBottom: 8,
    },
    textHeaders: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    textHeaders2: {
        fontSize: 12,
        color: '#334155',
    },
    view3: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
    touchablePress: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        borderColor: '#8B9E39',
        borderWidth: 2,
    },
    touchable: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    touchableCold: {
        backgroundColor: '#DBEAFE',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: '#60A5FA',
    },

    view4: { display: 'flex', flexDirection: 'row', gap: 16, width: '100%', flexWrap: 'wrap' },
});

const stylesCel = StyleSheet.create({

    textHeaders: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    view3: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
    touchablePress: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        borderColor: '#8B9E39',
        borderWidth: 2,
        flexWrap: 'wrap',
        width: '100%',
    },
    touchable: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    touchableCold: {
        backgroundColor: '#DBEAFE',
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: '100%',
        borderWidth: 1,
        borderColor: '#60A5FA',
    },
    view4: { display: 'flex', flexDirection: 'row', gap: 12, width: '100%', flexWrap: 'wrap' },
});
