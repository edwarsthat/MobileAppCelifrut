/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Keychain from 'react-native-keychain';
import useEnvContext from '../../../hooks/useEnvContext';

export default function HistorialDescarteEnceradoProceso(): React.JSX.Element {
    const {url: URL} = useEnvContext();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [itemSeleccionado, setItemSeleccionado] = useState('');
    useEffect(() => {
        obtenerData();
    }, []);

    const obtenerData = async () => {
        try {
            setLoading(true);
            //se obtiene el token de acceso
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('Error no hay token de validadcion');
            }
            const { password } = credentials;
            const token = password;

            const dataHistorialJSON = await fetch(`${URL}/proceso/data_historial_descarte_encerado_proceso`, {
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
            {!loading
                ?
                <SafeAreaView>
                    <Text style={styles.title}>Historial Descarte Encerado</Text>
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
                :
                <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />}
        </View>
    );
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 250,
    },
    container: {
        width: '100%',
        padding: 10,
        backgroundColor: "#EEFBE5",
        height: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
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
    descarteContainer:{
        backgroundColor:'white',
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
        marginTop:-10,
        margin: 2,

    },
});
