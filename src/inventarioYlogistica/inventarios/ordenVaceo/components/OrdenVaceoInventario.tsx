/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { lotesType } from "../../../../../types/lotesType";


type propsType = {
    data: lotesType
    add_to_ordenVaceo: (id:string) => void
}


export default function OrdenVaceoInventario(props:propsType): React.JSX.Element{
    const [moreInfo, setMoreInfo] = useState<boolean>(false);


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.itemStyle} onPress={() => setMoreInfo(!moreInfo)}>
                <View>
                    <Text style={styles.textStyle}>{props.data.enf}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>{props.data.predio.PREDIO}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>Kilos: {" "}
                        {(props.data?.inventario && props.data.promedio) ?
                            (props.data.inventario * props.data.promedio).toFixed(2) : 0}
                        Kg
                    </Text>
                </View>
                <View>
                    <Text style={styles.textStyle}> Canastillas: {props.data.inventario}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>{props.data.tipoFruta}</Text>
                </View>
            </TouchableOpacity>
            {moreInfo &&
                <View style={styles.descarteContainer}>
                    <View>
                        <Text style={styles.textStyle}>ICA: {props.data.predio.ICA}</Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>
                            Fecha Ingreso:
                            {new Date(props.data.fechaIngreso ?
                                props.data.fechaIngreso : new Date()).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>Calidad: {props.data.clasificacionCalidad}</Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>Obervaciones: {props.data.observaciones}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button title="Asignar a orden de vaceo" onPress={():void => props.add_to_ordenVaceo(props.data._id)} />
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 4 },
    itemStyle: {
        margin: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 65,
        justifyContent: 'space-around',
        alignContent: 'center',
        borderColor: 'black',
        borderRadius: 14,
        marginTop: 15,
        padding: 8,
        gap: 15,
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
    textStyle: {
        width: 'auto',
    },
    descarteContainer: {
        backgroundColor: 'white',
        padding: 8,
        shadowColor: '#32325D',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        marginTop: -10,
        margin: 2,
        paddingLeft: 25,
        paddingTop: 15,

    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 15,
    },
});
