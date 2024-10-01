/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, Alert, ActivityIndicator, TouchableOpacity, Image, TextInput } from "react-native";
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { AppState } from 'react-native';
import { lotesType } from "../../../../../types/lotesType";
import RNFS from 'react-native-fs';
import * as Keychain from "react-native-keychain";
import useEnvContext from "../../../../hooks/useEnvContext";

type propsType = {
    lote: lotesType | null
}
export default function Camara(props: propsType): React.JSX.Element {
    const {url} = useEnvContext();
    const camera = useRef<Camera>(null);
    const device = useCameraDevice('back');
    const appState = useRef(AppState.currentState);
    const format = useCameraFormat(device, [
        { photoResolution: { width: 250, height: 250 } },
    ]);
    const [, setAppStateVisible] = useState(appState.current);
    const [key, setKey] = useState(Math.random());
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const [imageSource, setImageSource] = useState<string>('');
    const [nomnbreFoto, setNombreFoto] = useState<string>('');


    useEffect(() => {
        getPermission();
        async function getPermission() {
            await Camera.requestCameraPermission();
            //console.log(`Camera permission status: ${permission}`);
        }
        getPermission();
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            restartCamera();
        });
        return () => {
            subscription.remove();
        };
    }, []);
    const restartCamera = () => {
        setKey(Math.random());
    };

    const capturarFoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto();
            setImageSource(photo.path);
            setShowCamera(false);
        }
    };

    const sendImage = async () => {
        try {
            if (!props.lote) {
                throw new Error("Seleccione un lote de la lista");
            }
            if (nomnbreFoto === '') {
                throw new Error('Ingrese una descripcion de la foto');
            }
            setModalVisible(true);
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error("Error no hay token de validadcion");
            }
            const { password } = credentials;
            const token = password;

            //leer
            const data = await RNFS.readFile(`file://'${imageSource}`, 'base64');
            const request = {
                action: 'ingresar_foto_calidad',
                _id: props.lote._id,
                fotoName: nomnbreFoto,
                foto: data,
            };
            const responseJSON = await fetch(`${url}/proceso/add-fotos-calidad`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            setShowCamera(true);
            Alert.alert("Guardado con exito");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.name}: ${err.message}`);
            }
        } finally {
            setModalVisible(false);
        }
    };

    if (device == null) {
        return <Text>Camera not available</Text>;
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                </View>
            </Modal>
            {showCamera ? (
                <>
                    <Camera
                        key={key}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={showCamera}
                        ref={camera}
                        photo={true}
                        format={format}
                        photoQualityBalance="speed"
                        enableDepthData
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.camButton} onPress={capturarFoto} />
                    </View>
                </>
            ) : (
                <>
                    {imageSource !== '' ? (
                        <Image
                            style={StyleSheet.absoluteFill}
                            source={{
                                uri: `file://'${imageSource}`,
                            }}
                        />
                    ) : null}

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.touchableButton}
                                onPress={() => setShowCamera(true)}>
                                <Text style={styles.textStyletouchable}>
                                    Borrar
                                </Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={text => setNombreFoto(text)} />
                            <TouchableOpacity
                                onPress={sendImage}
                                style={styles.touchableSendImage}>
                                <Text style={styles.textStyletouchable2}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        top: 30,
        backgroundColor: "#EEFBE5",
        paddingTop: 10,
        paddingBottom: 50,
        height: '100%',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        padding: 20,
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: -190,
        padding: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#49659E',
        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        aspectRatio: 10 / 16,
        resizeMode: 'cover',
    },
    textInput: {
        backgroundColor: '#9E9331',
        borderRadius: 10,
        width: 150,
        color: 'white',
        borderWidth: 2,
        borderColor: '#9E3C29',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: 'gray',
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    touchableButton: {
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#9E3C29',
    },
    textStyletouchable: { color: '#9E3C29', fontWeight: '500' },
    textStyletouchable2: { color: 'white', fontWeight: '500' },
    touchableSendImage: {
        backgroundColor: '#9E3C29',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
});
