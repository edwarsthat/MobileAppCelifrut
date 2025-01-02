import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import useEnvContext from '../../../hooks/useEnvContext';
import { useAppContext } from '../../../hooks/useAppContext';
import { getCredentials } from '../../../../utils/auth';

export default function HistorialDescarteLavadoProceso(): React.JSX.Element {
    const { url: URL } = useEnvContext();
    const { setLoading } = useAppContext();
    const [data, setData] = useState();
    const [itemSeleccionado, setItemSeleccionado] = useState('');
    useEffect(() => {
        obtenerData();
    }, []);

    const obtenerData = async () => {
        try {
            setLoading(true);
            //se obtiene el token de acceso
            const  password  = await getCredentials();
            const token = password;

            const dataHistorialJSON = await fetch(`${URL}/proceso/data_historial_descarte_lavado_proceso`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const dataHistorial = await dataHistorialJSON.json();
            if (dataHistorial.status !== 200) {
                throw new Error(`Code ${dataHistorial.status}: ${dataHistorial.message}`);
            }
            setData(dataHistorial.data);

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.title}>Historial Descarte Lavado</Text>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity style={styles.itemStyle} onPress={(): void => setItemSeleccionado(item._id)}>
                                <Text style={styles.textStyle}>{item.documento.enf}</Text>
                                <Text style={styles.textStyle}>{item.documento.predio.PREDIO}</Text>
                                <Text style={styles.textStyle}>{item.user}</Text>
                                <Text style={styles.textStyle}>{item.documento.tipoFruta}</Text>
                                <Text style={styles.textStyle}>{new Date(item.createdAt).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</Text>
                            </TouchableOpacity>
                            {itemSeleccionado === item._id ?
                                <View style={styles.descarteContainer}>
                                    {Object.keys(item.documento.descartes).map(key => {
                                        const descarte = key.split(".");
                                        return (
                                            <Text key={key + item._id}>
                                                {descarte[1] + " : " + item.documento.descartes[key]} Kg
                                            </Text>
                                        );
                                    })}
                                </View>
                                : null
                            }
                        </View>
                    )}
                    keyExtractor={item => item._id}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#EEFBE5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#2F4F4F',
    },
    itemStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 8,
        padding: 10,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderColor: 'black',
        // Sombra
        shadowColor: '#32325D',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    textStyle: {
        fontSize: 14,
        color: '#333',
    },
    descarteContainer: {
        backgroundColor: 'white',
        padding: 8,
        margin: 2,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        // Sombra
        shadowColor: '#32325D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        marginTop: -5,
    },
});

