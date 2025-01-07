import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import HorizontalLine from "../../../components/HorizontalLine";
import { getCredentials } from "../../../../utils/auth";
import { lotesType } from "../../../../types/lotesType";
import TablaFruta from "./components/TablaFruta";
import useEnvContext from "../../../hooks/useEnvContext";
import { sumatoriasInventario } from "./functions/sum";

export default function InventarioFrutaSinProcesar(): React.JSX.Element {
    const { url } = useEnvContext();
    const [filtro, setFiltro] = useState<string>('');
    const [data, setData] = useState<lotesType[]>();
    const [dataOriginal, setDataOriginal] = useState<lotesType[]>();
    const [total, setTotal] = useState<number>(0);
    const [limon, setLimon] = useState<number>(0);
    const [naranja, setNaranja] = useState<number>(0);

    useEffect(() => {
        const obtenerFruta = async () => {
            try {
                const token = await getCredentials();
                const requesOperariosJSON = await fetch(`${url}/proceso/getInventario`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `${token}`,
                    },
                });
                const response = await requesOperariosJSON.json();
                if (response.status !== 200) {
                    throw new Error(`Cose ${response.status}: ${response.message}`);
                }
                setData(response.data);
                setDataOriginal(response.data);
                const [to, li, na] = sumatoriasInventario(response.data);
                setTotal(to);
                setLimon(li);
                setNaranja(na);
            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(err.message);
                }
            }
        };
        obtenerFruta();
    }, [url]);
    useEffect(() => {
        if (dataOriginal !== undefined && filtro !== '') {
            const datos = dataOriginal.filter(lote =>
            (lote.predio.PREDIO.toLowerCase().startsWith(filtro.toLowerCase()) ||
                lote.tipoFruta.toLowerCase().startsWith(filtro.toLowerCase()) ||
                (
                    lote.enf &&
                    lote.enf.toLowerCase().startsWith(filtro.toLowerCase())
                )));
            const [to, na, li] = sumatoriasInventario(datos);
            setTotal(to);
            setLimon(li);
            setNaranja(na);
            setData(datos);

        } else if (filtro === '') {
            setData(dataOriginal);
            const [to, li, na] = sumatoriasInventario(dataOriginal ?? []);
            setTotal(to);
            setLimon(li);
            setNaranja(na);
        }

    }, [filtro, dataOriginal]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fruta sin procesar</Text>
            <HorizontalLine />

            <View style={styles.containerForm}>
                <Text style={styles.textInputs}>Búsqueda</Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Ingrese lote o predio"
                    inputMode="text"
                    onChangeText={(value) => setFiltro(value)}
                    value={filtro}
                />
            </View>

            <View style={styles.totalsContainer}>
                <View style={styles.cardStyle}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{total.toFixed(2)} Kg</Text>
                </View>
                <View style={[styles.cardStyle, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={styles.totalLabel}>Total Limón</Text>
                    <Text style={[styles.totalValue, { color: '#388E3C' }]}>{limon.toFixed(2)} Kg</Text>
                </View>
                <View style={[styles.cardStyle, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={styles.totalLabel}>Total Naranja</Text>
                    <Text style={[styles.totalValue, { color: '#F57C00' }]}>{naranja.toFixed(2)} Kg</Text>
                </View>
            </View>

            <TablaFruta data={data} />
        </View>
    );
}

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingTop: 10,
    },
    title: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    containerForm: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    inputs: {
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        width: width * 0.85,
        paddingVertical: 5,
        marginTop: 12,
        borderRadius: 12,
        paddingLeft: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    textInputs: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    totalsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    cardStyle: {
        width: width * 0.85,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 4,
    },
});
