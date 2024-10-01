/* eslint-disable prettier/prettier */

import React, { useRef, useState } from "react";
import { Animated, Button, Dimensions, PanResponder, StyleSheet, Text, View } from "react-native";
import { lotesType } from "../../../../../types/lotesType";

type propsType = {
    lote: lotesType,
    index: number
    handleChangeOrdenVaceo: (index: number, newIndex: number) => void
    handleDragStart: (e:number) => void
    handleDragEnd: () => void
}


export default function OrdenVaceoTarjetaPredio(props: propsType): React.JSX.Element {
    const [pan] = useState(new Animated.ValueXY());
    const { height } = Dimensions.get('window');



    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                props.handleDragStart(props.index);
            },
            onPanResponderMove: Animated.event([
                null,
                { dy: pan.y },
            ], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                // Calcula el índice basado en la posición relativa
                const startOffset = height * 0.3; // Asume que los elementos comienzan en el 30% de la pantalla
                const endIndex = Math.floor((gestureState.moveY - startOffset) / 158);
                console.log(gestureState.moveY);
                if (endIndex !== 0) {
                    props.handleChangeOrdenVaceo(props.index, endIndex - 1);
                }
                // pan.y.removeListener(listenerId);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <View style={styles.container} >
            <Animated.View
                {...panResponder.panHandlers}
                style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                }}
            >
                <View style={styles.itemStyle}>
                    <View style={styles.infoItemStyle} >
                        <View>
                            <Text style={styles.textStyle}>{props.index + 1}</Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}>{props.lote.enf}</Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}>{props.lote.predio.PREDIO}</Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}>
                                {new Date(props.lote.fechaIngreso ?
                                    props.lote.fechaIngreso : new Date()).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}>Kilos: {" "}
                                {(props.lote?.inventario && props.lote.promedio) ?
                                    (props.lote.inventario * props.lote.promedio).toFixed(2) : 0}
                                Kg
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}> Canastillas: {props.lote.inventario}</Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle}>{props.lote.tipoFruta}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button title="Mover al inventario" />
                    </View>

                </View>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 4, marginRight: 30 },
    itemStyle: {
        margin: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 150,
        justifyContent: 'space-around',
        alignContent: 'center',
        borderColor: 'black',
        borderRadius: 14,
        marginTop: 15,
        padding: 8,
        shadowColor: '#32325D',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#FFFFFF',
    },
    infoItemStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,

    },
    textStyle: {
        width: 'auto',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
