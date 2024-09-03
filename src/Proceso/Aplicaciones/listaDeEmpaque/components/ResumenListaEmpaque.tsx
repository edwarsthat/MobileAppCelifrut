/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Switch } from "react-native";
import HorizontalLine from "../../../../components/HorizontalLine";
import { contenedoresContext, contenedorSeleccionadoContext } from "../ListaDeEmpaque";
import { obtenerResumen } from "../controller/resumenes";

export default function ResumenListaEmpaque(): React.JSX.Element {
    const contenedores = useContext(contenedoresContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const [cajasTotal, setCajasTotal] = useState<number>(0);
    const [kilosTotal, setKilosTotal] = useState<number>(0);
    const [cajasCalidad, setCajasCalidad] = useState<object>();
    const [kilosCalidad, setkilosCalidad] = useState<object>();
    const [cajasCalibre, setCajasCalibre] = useState<object>();
    const [kilosCalibre, setkilosCalibre] = useState<object>();
    const [soloHoy, setSoloHoy] = useState<boolean>(false);
    const toggleSwitch = () => setSoloHoy(previousState => !previousState);
    useEffect(() => {
        let cont;
        if (numeroContenedor === undefined || numeroContenedor === -1) {
            cont = contenedores;
        } else {
            const contenedor = contenedores?.find(c => c.numeroContenedor === numeroContenedor);
            cont = [contenedor];
        }
        const resumen = obtenerResumen(cont, soloHoy);
        if (resumen !== null) {
            const {
                kilos_por_calibre,
                kilos_por_calidad,
                cajas_por_calibre,
                cajas_por_calidad,
                kilo_total,
                total_cajas,

            } = resumen;
            setKilosTotal(kilo_total);
            setCajasCalidad(cajas_por_calidad);
            setCajasTotal(total_cajas);
            setkilosCalidad(kilos_por_calidad);
            setCajasCalibre(cajas_por_calibre);
            setkilosCalibre(kilos_por_calibre);
        }
    }, [numeroContenedor, contenedores, soloHoy]);
    return (
        <View style={styles.container1}>
            <View style={styles.container2}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Resumen</Text>
                    <View style={styles.containerSoloHoy}>
                        <Text>Solo hoy</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={soloHoy ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={soloHoy}
                        />
                    </View>
                </View>
                <HorizontalLine />
                <View style={styles.containerResumenes}>
                    <View style={styles.containerItem}>
                        <Text>Total:</Text>
                        <HorizontalLine />

                        <View>
                            <Text>{cajasTotal.toLocaleString('es-CO')} cajas</Text>
                            <Text>{kilosTotal.toLocaleString('es-CO')} Kg</Text>
                        </View>
                    </View>
                    <View style={styles.containerItem}>
                        <Text>Por calidad</Text>
                        <HorizontalLine />

                        <View>
                            {cajasCalidad && Object.entries(cajasCalidad).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} cajas // </Text>
                            ))}
                            {kilosCalidad && Object.entries(kilosCalidad).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} Kg //</Text>
                            ))}
                        </View>
                    </View>
                    <View style={styles.containerItem}>
                        <Text>Por calibre</Text>
                        <HorizontalLine />

                        <View>
                            {cajasCalibre && Object.entries(cajasCalibre).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} cajas //</Text>
                            ))}
                            {kilosCalibre && Object.entries(kilosCalibre).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"} {value.toLocaleString('es-CO')} Kg //</Text>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        width: "100%",
        height: windowHeight - 250, // Use the actual device height
        justifyContent: 'center',
        alignItems: 'center', // Changed from alignContent to alignItems
    },
    container2: {
        backgroundColor: 'white',
        width: "90%",
        height: "90%",
        borderRadius: 18,
        padding: 15,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    containerSoloHoy: {
        display: 'flex',
        flexDirection: 'column',
        width: 60,
    },
    containerResumenes: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
    },
    containerItem: {
        width: 'auto',
        borderStyle: "solid",
        borderWidth: 1,
        padding: 18,
        borderRadius: 15,
    },
});
