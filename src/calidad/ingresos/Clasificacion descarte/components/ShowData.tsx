/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import { elementoDefectoType, elementoPorcentajeType, LabelsTypes } from "../types/clasificacionTypes";
import { dataDefectos } from "../functions/data";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

type propsType = {
    dataArray: elementoDefectoType[]
    eliminarItem: (index:number) => void
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
                    <TouchableOpacity onPress={():void => props.eliminarItem(index)} style={styles.buttonEliminar}>
                        <Text style={styles.textButtonEliminar}>X</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#DFE0AE',
        borderRadius:15,
        marginTop:15,
        padding:8,
    },
    containerDefecto:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:8,
        alignItems:'center',
    },
    containerDefectoTexto:{
        flexDirection:'row',
    },
    buttonEliminar:{
        borderWidth:1,
        borderColor:'red',
        padding:6,
        borderRadius:7,
        backgroundColor:'red',
    },
    textButtonEliminar:{
        fontSize:18,
        color:'white',
        fontWeight:'bold',
    },
});
