import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Keychain from 'react-native-keychain';
import useEnvContext from "../../../hooks/useEnvContext";
import { useAppStore } from "../../../stores/useAppStore";


export default function HistorialFotosCalidad(): React.JSX.Element {
    const { url: URL } = useEnvContext();
    const setLoading = useAppStore((state) => state.setLoading);

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
            setLoading(true);
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
            setLoading(false);

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaViewStyle}>
                <Text style={styles.title}>Historial Fotos Calidad</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <TouchableOpacity style={styles.itemStyle} onPress={() => handlePress(item)}>
                                <Text style={styles.textStyle}>{item.lote.enf}</Text>
                                <Text style={styles.textStyle}>{item.lote.predio.PREDIO}</Text>
                                <Text style={styles.textStyle}>{item.user}</Text>
                                <Text style={styles.textStyle}>{item.lote.tipoFruta}</Text>
                                <Text style={styles.textStyle}>
                                    {new Date(item.createdAt).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                                </Text>

                                {itemSeleccionado === item._id && (
                                    <View style={styles.fotosContainer}>

                                        <View>
                                            {defecto && <Text style={styles.defectoText}>{defecto}</Text>}
                                            {image && <Image source={{ uri: image }} style={styles.image} />}
                                        </View>

                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 250,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#F2F9F2', // Fondo sutil, verde muy claro
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    safeAreaViewStyle: { flex: 1 },
    /* Envoltorio para dar un margen alrededor de cada “card” */
    cardWrapper: {
        marginVertical: 8,
        marginHorizontal: 5,
    },
    /* Estilo principal del ítem a modo de “card” */
    itemStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 12,

        // Sombra (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        // Sombra (Android)
        elevation: 3,
    },
    /* Estilo para cada texto dentro del ítem */
    textStyle: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    /* Contenedor donde se muestran las fotos al hacer click */
    fotosContainer: {
        marginTop: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,

        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    defectoText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});
