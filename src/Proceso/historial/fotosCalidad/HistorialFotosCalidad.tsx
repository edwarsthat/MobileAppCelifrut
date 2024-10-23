/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Keychain from 'react-native-keychain';
import useEnvContext from "../../../hooks/useEnvContext";


export default function HistorialFotosCalidad(): React.JSX.Element {
    const { url:URL } = useEnvContext();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [data, setData] = useState();
    const [itemSeleccionado, setItemSeleccionado] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [defecto, setDefecto] = useState<string | null>(null);
    useEffect(() => {
        obtenerHistorial();
    }, []);
    const obtenerHistorial = async (): Promise<void> => {
        try {
            setLoading(true);
            //se obtiene el token de acceso
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('Error no hay token de validadcion');
            }
            const { password } = credentials;
            const token = password;

            const dataHistorialJSON = await fetch(`${URL}/proceso/data_historial_fotos_calidad_proceso`, {
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
            console.log(dataHistorial);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const handlePress = async (item: any) => {
        try {
            setLoading2(true);
            setItemSeleccionado(item._id);
            const url = Object.keys(item.documento).filter(key => (key !== '_id' && key !== 'calidad.fotosCalidad.fechaIngreso'));
            const imageURL = item.documento[url[0]];
            //se obtiene el token de acceso
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('Error no hay token de validadcion');
            }
            const { password } = credentials;
            const token = password;
            const fotoJSON = await fetch(`${URL}/proceso/data_obtener_foto_calidad?fotoURL=${imageURL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const foto = await fotoJSON.json();
            setImage(`data:image/jpeg;base64,${foto.data}`);
            const defectoS = url[0].split(".");
            setDefecto(defectoS[2]);
            setLoading2(false);

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        } finally {
            setLoading2(false);
        }
    };
    return (
        <View style={styles.container}>
            {!loading
                ?
                <SafeAreaView>
                    <Text style={styles.title}>Historial Fotos Calidad</Text>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity style={styles.itemStyle} onPress={() => handlePress(item)}>
                                    <Text style={styles.textStyle}>{item.lote.enf}</Text>
                                    <Text style={styles.textStyle}>{item.lote.predio.PREDIO}</Text>
                                    <Text style={styles.textStyle}>{item.user}</Text>
                                    <Text style={styles.textStyle}>{item.lote.tipoFruta}</Text>
                                    <Text style={styles.textStyle}>{new Date(item.createdAt).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</Text>
                                    {itemSeleccionado === item._id &&
                                        <View style={styles.fotosContainer}>
                                            {loading2 ?
                                                <ActivityIndicator size="large" color="#00ff00" /> :
                                                <View>
                                                    {defecto && <Text>{defecto}</Text>}
                                                    {image && <Image source={{ uri: image }} style={styles.image} />}
                                                </View>
                                            }
                                        </View>
                                    }
                                </TouchableOpacity>
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
        height: 'auto',
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
    fotosContainer: {
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
        borderRadius: 15,
        marginTop: 0,
        margin: 2,

    },
    image: {
        width: 200,
        height: 200,
      },
});
