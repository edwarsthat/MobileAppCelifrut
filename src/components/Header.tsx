import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text, Alert, Modal, FlatList } from 'react-native';
import useEnvContext from '../hooks/useEnvContext';
import { lotesType } from '../../types/lotesType';
import { useAppContext } from '../hooks/useAppContext';
const logoImage = require('../../assets/logo_app.png');

type propsType = {
    seleccionWindow: (e: string) => void
    section: string
    setLote: (e:lotesType) => void
}

export default function Header(props: propsType) {
    const { url } = useEnvContext();
    const { setLoading } = useAppContext();
    const [lotes, setLotes] = useState<lotesType[] | null>(null);
    const [lote, setLote] = useState<lotesType | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (props.section === '66b6705a77549ed0672a9026') {
            const obtenerDataPredios = async () => {
                try {
                    setLoading(true);
                    const responseJSON = await fetch(`${url}/proceso/lotes-fotos-calidad/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const response = await responseJSON.json();
                    if (response.status !== 200) {
                        throw new Error(`Code ${response.status}: ${response.message}`);
                    }
                    setLotes(response.data);
                } catch (err) {
                    if (err instanceof Error) {
                        console.log(err.name, err.message);
                        Alert.alert('Error obteniendo los datos del servidor');
                    }
                } finally {
                    setLoading(false);
                }
            };
            obtenerDataPredios();
        }
    }, [props.section]);
    return (
        <View style={styles.headerContainer}>

            <TouchableOpacity style={styles.menuButton} onPress={(): void => props.seleccionWindow('menu')}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>

            {props.section === '66b6705a77549ed0672a9026' &&
                <TouchableOpacity style={styles.botonLotes}
                    onPress={() => setModalVisible(true)}
                >
                    <Text>{lote ? lote.enf + " " + lote.predio.PREDIO : 'Seleccione predio'}</Text>

                </TouchableOpacity>
            }

            <Image source={logoImage} style={styles.logo} />

            <View style={styles.placeholder} />
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centerModal}>
                    <View style={styles.viewModal}>

                        <FlatList
                            data={lotes}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pressableStyle}
                                    onPress={() => {
                                        setLote(item);
                                        props.setLote(item);
                                        setModalVisible(false);
                                    }}>
                                    <Text style={styles.textList}>{item.enf} -- {item.predio.PREDIO}</Text>
                                </TouchableOpacity>)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: '100%', // Ocupa todo el ancho disponible
        height: 60,
        backgroundColor: '#fff', // Fondo blanco para resaltar
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex:100000,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    menuButton: {
        padding: 8,
    },
    menuText: {
        fontSize: 24,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    placeholder: {
        width: 32,
    },
    botonLotes: {
        backgroundColor: 'white',
        width: 250,
        height: 50,
        marginLeft: '5%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        marginTop: '18%',
    },
    viewModal: {
        backgroundColor: 'white',
        width: '90%',
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
    },
    pressableStyle: {
        marginTop: 10,
        marginBottom: 10,
    },
    textList: {
        color: 'black',
        marginLeft: 10,
        marginRight: 15,
        fontSize: 18,
    },
});
