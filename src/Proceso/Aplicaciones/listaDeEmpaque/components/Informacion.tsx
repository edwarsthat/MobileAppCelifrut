/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import {  StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { cajasSinPalletContext, contenedorSeleccionadoContext, contenedoresContext, itemSeleccionContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { deviceWidth } from "../../../../../App";

type propsType = {
    setSeleccion: (data: number[]) => void;
};

export default function Informacion(props: propsType): React.JSX.Element {
    const anchoDevice = useContext(deviceWidth);
    const pallet = useContext(palletSeleccionadoContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const contenedor = useContext(contenedoresContext).find(item => item._id === numeroContenedor);
    const seleccion = useContext(itemSeleccionContext);
    const cajasSinPallet = useContext(cajasSinPalletContext);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
    }, [anchoDevice]);

    const handleSeleccion = (index: number) => {
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
    return (
        <>
            {pallet === -1 ?
                (<View style={styles.scrollStyle}>
                    <FlatList
                        data={cajasSinPallet}
                        renderItem={({ item, index }) => (
                            <View style={styles.container} key={index + index}>
                                <View style={styles.containerHeader}>
                                    <View key={index + 'view2'}>
                                        <Text style={styles.textHeaders}>{item.lote.enf}</Text>
                                    </View>
                                    <View key={item.lote.enf + 'view3'}>
                                        <View style={styles.view3} key={index + 'view4'}>
                                            <Text key={index + 'nombrPredioHeader'} style={styles.textHeaders}>
                                                Nombre Predio:{' '}
                                            </Text>
                                            <Text key={index + 'nombrPredio'} style={styles.textHeaders}>
                                                {item.lote.predio}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={seleccion.includes(index) ? styles.touchablePress : styles.touchable}
                                    onPress={() => handleSeleccion(index)}>
                                    <View style={styles.view3}>
                                        <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{'No. Cajas:'} </Text>
                                        <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.cajas}</Text>
                                    </View>
                                    <View style={styles.view4}>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{'Tipo Caja:'} </Text>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.tipoCaja}</Text>
                                        </View>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>Calibre: </Text>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.calibre}</Text>
                                        </View>
                                        <View style={styles.view3}>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>Calidad: </Text>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.calidad}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )} />

                    {/* {cajasSinPallet.map((item, index) => (
                        <View style={styles.container} key={index + index}>
                            <View style={styles.containerHeader}>
                                <View key={index + 'view2'}>
                                    <Text style={styles.textHeaders}>{item.lote.enf}</Text>
                                </View>
                                <View key={item.lote.enf + 'view3'}>
                                    <View style={styles.view3} key={index + 'view4'}>
                                        <Text key={index + 'nombrPredioHeader'} style={styles.textHeaders}>
                                            Nombre Predio:{' '}
                                        </Text>
                                        <Text key={index + 'nombrPredio'} style={styles.textHeaders}>
                                            {item.lote.predio}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={seleccion.includes(index) ? styles.touchablePress : styles.touchable}
                                onPress={() => handleSeleccion(index)}>
                                <View style={styles.view3}>
                                    <Text>{'No. Cajas:'} </Text>
                                    <Text>{item.cajas}</Text>
                                </View>
                                <View style={styles.view4}>
                                    <View style={styles.view3}>
                                        <Text>{'Tipo Caja:'} </Text>
                                        <Text>{item.tipoCaja}</Text>
                                    </View>
                                    <View style={styles.view3}>
                                        <Text>Calibre: </Text>
                                        <Text>{item.calibre}</Text>
                                    </View>
                                    <View style={styles.view3}>
                                        <Text>Calidad: </Text>
                                        <Text>{item.calidad}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))} */}
                </View>)
                : (
                    <View style={styles.scrollStyle}>
                        {contenedor &&
                        <FlatList
                            data={contenedor.pallets[pallet].EF1}
                            renderItem={({ item, index }) => (
                                <View style={styles.container}>
                                    <View style={styles.containerHeader}>
                                        <View key={index + 'view2'}>
                                            <Text style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>{item.lote.enf}</Text>
                                        </View>
                                        <View >
                                            <View style={styles.view3} key={index + 'view4'}>
                                                <Text key={index + 'nombrPredioHeader'} style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>
                                                    Nombre Predio:{' '}
                                                </Text>
                                                <Text key={index + 'nombrPredio'} style={isTablet ? styles.textHeaders : stylesCel.textHeaders}>
                                                    {item.lote.predio}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={isTablet ? seleccion.includes(index) ? styles.touchablePress : styles.touchable
                                            : seleccion.includes(index) ? stylesCel.touchablePress : stylesCel.touchable
                                        }
                                        onPress={() => handleSeleccion(index)}>
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
                                                <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>{item.calibre}</Text>
                                            </View>
                                            <View style={styles.view3}>
                                                <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>Calidad: </Text>
                                                <Text style={isTablet ? styles.textHeaders2 : stylesCel.textHeaders}>{item.calidad}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />}

                    </View>
                )}
        </>
    );
}

const styles = StyleSheet.create({
    scrollStyle: {
        backgroundColor: '#FFE6FF',
        padding: 5,
        elevation: 10,
        shadowColor: '#52006A',
        flex: 1,
        width:"100%",
    },
    container: {
        margin: 5,
    },
    containerHeader: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: '#4D4D4D',
        overflow: 'scroll',
    },
    textHeaders: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    textHeaders2: {
        fontSize: 8,
    },
    view3: { display: 'flex', flexDirection: 'row' },
    touchablePress: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 8,
        borderColor: 'red',
        borderWidth: 2,
    },
    touchable: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',


    },

    view4: { display: 'flex', flexDirection: 'row', gap: 20, width: '100%' },
});

const stylesCel = StyleSheet.create({

    textHeaders: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    view3: { display: 'flex', flexDirection: 'row' },
    touchablePress: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 8,
        borderColor: 'red',
        borderWidth: 2,
        flexWrap: 'wrap', width: '70%',
    },
    touchable: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap', width: '70%',
    },
    view4: { display: 'flex', flexDirection: 'row', gap: 10, width: '100%' },
});
