
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { lotesType } from "../../../../../types/lotesType";

type propsType = {
    lote: lotesType,
    index: number
}


export default function OrdenVaceoTarjetaPredio(props: propsType): React.JSX.Element {
    return (
        <View style={styles.container}>
        <View style={styles.itemStyle}>
            <View style={styles.infoItemStyle}>
                <View style={styles.indexContainer}>
                    <Text style={styles.indexText}>{props.index + 1}</Text>
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.title}>{props.lote.enf}</Text>
                    <Text style={styles.subtitle}>{props.lote.predio.PREDIO}</Text>
                    <Text style={styles.date}>
                        {new Date(props.lote.fechaIngreso ?
                            props.lote.fechaIngreso : new Date()).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Kilos:{" "}
                    <Text style={styles.detailHighlight}>
                        {(props.lote?.inventario && props.lote.promedio) ?
                            (props.lote.inventario * props.lote.promedio).toFixed(2) : 0}
                    </Text> Kg
                </Text>
                <Text style={styles.detailText}>Canastillas:{" "}
                    <Text style={styles.detailHighlight}>{props.lote.inventario}</Text>
                </Text>
                <Text style={styles.detailText}>{props.lote.tipoFruta}</Text>
            </View>

        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        marginHorizontal: 16,
    },
    itemStyle: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    infoItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    indexContainer: {
        backgroundColor: '#4CAF50',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    indexText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 2,
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    detailsContainer: {
        marginTop: 12,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    detailHighlight: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    buttonsContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
});
