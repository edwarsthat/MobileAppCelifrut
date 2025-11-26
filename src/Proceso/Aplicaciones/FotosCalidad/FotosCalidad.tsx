
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Modal, TouchableOpacity, Text } from 'react-native';
import { lotesType } from '../../../../types/lotesType';
import Camara from './components/Camara';
import ListaLotes from './components/ListaLotes';
import { useAppStore } from '../../../stores/useAppStore';
import { getCredentials } from '../../../../utils/auth';
import { useSocketStore } from '../../../stores/useSocketStore';

export default function FotosCalidad(): React.JSX.Element {
    const setLoading = useAppStore(state => state.setLoading);
    const socketRequest = useSocketStore(state => state.sendRequest);
    const [lotes, setLotes] = useState<lotesType[]>([]);
    const [selectedLote, setSelectedLote] = useState<lotesType | undefined>();
    const [modalVisible, setModalVisible] = useState(false);
    const obtenerLote = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = await getCredentials();
            const response = await socketRequest({
                token,
                data: { action: "get_proceso_aplicaciones_fotoCalidad" }
            });

            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            console.log(response.data);
            setLotes(response.data);

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error", err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                await obtenerLote();
            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert("Error", err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Seleccione un Lote</Text>
                        <ListaLotes data={lotes} onSelect={(item) => {
                            setSelectedLote(item);
                            setModalVisible(false);
                        }} />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.headerButton}
            >
                <Text style={styles.headerButtonText}>
                    {selectedLote
                        ? `Lote: ${selectedLote.enf} - ${selectedLote.predio?.PREDIO}`
                        : "Seleccionar Lote"
                    }
                </Text>
            </TouchableOpacity>

            <View style={styles.cameraContainer}>
                <Camara lote={selectedLote} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        height: '80%',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectButton: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    selectButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    changeLoteButton: {
        backgroundColor: '#FF9800',
        padding: 10,
        alignItems: 'center',
    },
    changeLoteText: {
        color: 'white',
        fontWeight: 'bold',
    },
    headerButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    headerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
    },
});
