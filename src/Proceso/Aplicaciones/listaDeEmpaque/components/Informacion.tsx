/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { cajasSinPalletContext, contenedorSeleccionadoContext, contenedoresContext, itemSeleccionContext, palletSeleccionadoContext } from "../ListaDeEmpaque";

type propsType = {
    setSeleccion: (data: number[]) => void;
};

export default function Informacion(props: propsType): React.JSX.Element {
    const pallet = useContext(palletSeleccionadoContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const contenedor = useContext(contenedoresContext).find(item => item.numeroContenedor === numeroContenedor);
    const seleccion = useContext(itemSeleccionContext);
    const cajasSinPallet = useContext(cajasSinPalletContext);


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
                (<ScrollView style={styles.scrollStyle} nestedScrollEnabled={true}>
                    {cajasSinPallet.map((item, index) => (
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
                    ))}
                </ScrollView>)
                : (
                    <ScrollView style={styles.scrollStyle} nestedScrollEnabled={true}>
                        {contenedor && (pallet !== -1)
                            ? contenedor.pallets[pallet].EF1.map((item, index) => (
                                typeof item.lote === 'object' &&
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
                            ))
                            : null}
                    </ScrollView>
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
        fontSize: 17,
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
    },
    touchable: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap', width: '75%',


    },
    view4: { display: 'flex', flexDirection: 'row', gap: 20, width: '100%' },
});
