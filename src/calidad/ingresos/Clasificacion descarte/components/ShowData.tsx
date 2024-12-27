import React, { useEffect, useState } from "react";
import { elementoDefectoType, elementoPorcentajeType, LabelsTypes } from "../types/clasificacionTypes";
import { dataDefectos } from "../functions/data";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

type propsType = {
    dataArray: elementoDefectoType[]
    eliminarItem: (index: number) => void
}
export default function ShowData(props: propsType): React.JSX.Element {
    const [data, setData] = useState<elementoPorcentajeType[]>([]);
    useEffect(() => {
        const total = props.dataArray.reduce((acu, item) => (acu += item.lavado + item.encerado), 0);
        if (total === 0) {
            setData([]);
            return;
        }
        const porcentages: elementoPorcentajeType[] = props.dataArray.map(item => {
            const totalDefecto = item.encerado + item.lavado;
            const porcentage = (totalDefecto * 100) / total;
            return { defecto: item.defecto, porcentage: porcentage };
        });
        setData(porcentages);
    }, [props.dataArray]);

    return (
        <View style={styles.container}>
            {data.map((item, index) => (
                <View key={index} style={styles.containerDefecto}>
                    <View style={styles.containerDefectoTexto}>
                        <Text>{dataDefectos[item.defecto as keyof LabelsTypes]}: </Text>
                        <Text>{item.porcentage.toFixed(2)}%</Text>
                    </View>
                    <TouchableOpacity onPress={(): void => props.eliminarItem(index)} style={styles.buttonEliminar}>
                        <Text style={styles.textButtonEliminar}>X</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    /* Contenedor principal (fondo con tono claro y algo de sombra) */
    container: {
        backgroundColor: '#DFE0AE',
        borderRadius: 12,
        marginVertical: 15,
        marginHorizontal: 12,
        padding: 10,
        // Sombra (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        // Sombra (Android)
        elevation: 2,
    },
    /* Contenedor de cada defecto */
    containerDefecto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        // Borde inferior para separar items (opcional)
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    /* Contenedor de los textos de defecto y porcentaje */
    containerDefectoTexto: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    defectoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    porcentajeText: {
        fontSize: 16,
        color: '#555',
    },
    /* Botón para eliminar */
    buttonEliminar: {
        backgroundColor: 'red',
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 6,
        // Sombra leve (opcional)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    textButtonEliminar: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});
