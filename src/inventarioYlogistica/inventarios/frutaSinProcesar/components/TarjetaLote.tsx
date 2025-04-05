import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { lotesType } from "../../../../../types/lotesType";

type propsType = {
    data: lotesType
}

export default function TaejetaLote(props: propsType): React.JSX.Element {
    const [moreInfo, setMoreInfo] = useState<boolean>(false);
    const animationHeight = useRef(new Animated.Value(0)).current;


    const toggleMoreInfo = () => {
        setMoreInfo(!moreInfo);
        Animated.timing(animationHeight, {
            toValue: moreInfo ? 0 : 150,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.itemStyle} onPress={toggleMoreInfo}>
                <View>
                    <Text style={styles.textStyle}>{props.data.enf}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>{props.data.predio.PREDIO}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>{props.data.tipoFruta}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>Canastillas: {props.data.inventario}</Text>
                </View>
                <View style={styles.viewKilosStyle}>
                    <Text style={styles.textStyle}>Kilos: {((props.data.inventario ?? 0) * (props.data.promedio ?? 0)).toFixed(2)} Kg</Text>

                    <Animated.View style={{ transform: [{ rotate: moreInfo ? '180deg' : '0deg' }] }}>
                        <Text>▼</Text>
                    </Animated.View>
                </View>
            </TouchableOpacity>
            {moreInfo &&
                <Animated.View style={[styles.descarteContainer, { height: animationHeight }]}>
                    <View>
                        <Text style={styles.textStyle}>ICA: {props.data.predio.ICA && props.data.predio.ICA.code}</Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>
                            Fecha Ingreso:
                            {new Date(props.data.fechaIngreso ? props.data.fechaIngreso : new Date()).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>Calidad: {props.data.clasificacionCalidad}</Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>Observaciones: {props.data.observaciones}</Text>
                    </View>
                </Animated.View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 4 },
    itemStyle: {
        margin: 6,
        flexDirection: 'column',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: '#FFF',
    },
    textStyle: {
        width: 'auto',
    },
    descarteContainer: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        marginTop: -8,
        marginHorizontal: 4,
        paddingLeft: 20,
        paddingTop: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',  // Un color para diferenciarlo
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 15,
    },
    viewKilosStyle: { flexDirection: 'row', alignItems: 'center' },
});
