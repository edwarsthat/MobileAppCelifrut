/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Dimensions, Button, Alert, NativeModules, ActivityIndicator } from 'react-native';
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { CargoType } from '../../types/cargosType';
import useEnvContext from '../hooks/useEnvContext';
const { ApkInstaller } = NativeModules;

type propsType = {
    showLoading: () => void
    setIslogin: (e: boolean) => void
    obtenerPermisos: (e:CargoType) => void
}

export default function Login(props: propsType): React.JSX.Element {
    const { url } = useEnvContext();
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<number>(0);
    const [isDownload, setIsDownload] = useState<boolean>(false);
    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const version = DeviceInfo.getVersion();
                const responseJSON = await fetch(`${url}/sistema/check_mobile_version`);
                const response = await responseJSON.json();
                if (version !== response.data.version) {
                    Alert.alert(
                        'Actualización disponible',
                        '¿Deseas actualizar la aplicación?',
                        [
                            { text: 'No', style: 'cancel' },
                            { text: 'Sí', onPress: () => downloadAndInstallUpdate(response.data) },
                        ]
                    );
                }
            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(err.message);
                }
            }
        };
        checkForUpdates();
    }, []);
    const handlelogin = async (): Promise<void> => {
        try {
            const responseJSON = await fetch(`${url}/login2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    password: password,
                }),
            });
            const response = await responseJSON.json();

            if (response.status === 401) {
                setError(401);
                setTimeout(() => {
                    setError(0);
                }, 3000);
                return;
            } else if (response.status === 402) {
                setError(402);
                setTimeout(() => {
                    setError(0);
                }, 3000);
                return;
            }
            else if (response.status === 200) {

                props.showLoading();
                props.setIslogin(true);
                props.obtenerPermisos(response.permisos);
                await Keychain.setGenericPassword('user', response.accesToken);
            }
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        }
    };
    const handleUser = (e: string) => {
        setUser(e.toLowerCase().trim());
    };
    const downloadAndInstallUpdate = async (data: { apkPath: string }) => {
        try {
            setIsDownload(true);
            const { apkPath } = data;

            // Definir la ruta donde se guardará el archivo
            const downloadDest = `${RNFS.ExternalDirectoryPath}/${apkPath}`;
            const download = await RNFS.downloadFile({
                fromUrl: `${url}/sistema/download_mobilApp/${apkPath}`,
                toFile: downloadDest,
                background: true,
                progressDivider: 1,
            });

            const result = await download.promise;

            if (result.statusCode !== 200) {
                throw new Error(`Error de descarga. Código de estado: ${result.statusCode}`);
            }

            // Iniciar la instalación usando el módulo nativo
            await ApkInstaller.installApk(downloadDest);

            console.log('Instalación iniciada');
            setIsDownload(false);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        }
    };
    return <View style={styles.container}>
        <Image style={styles.imgStyle} source={require('../../assets/CELIFRUT.webp')} />
        {isDownload ?
            <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
            :
            <>
                <View>
                    <Text style={styles.textStyle}>Usuario</Text>
                    <TextInput style={styles.inputStyle} onChangeText={handleUser} />
                    <Text style={styles.errorStyle}>{error === 401 && 'Error en el usuario'}</Text>
                    <Text style={styles.textStyle}>Contraseña</Text>
                    <TextInput
                        onChangeText={setPassword}
                        style={styles.inputStyle}
                        textContentType="password"
                        secureTextEntry={true}
                    />
                    <Text style={styles.errorStyle}>{error === 402 && 'Error en la contraseña'}</Text>
                </View>
                <Button title="Iniciar" color="#7D9F3A" onPress={handlelogin} />
            </>
        }

    </View>;
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight,
        marginBottom: 150,
    },
    imgStyle: {
        width: 150,
        height: 150,
    },
    textStyle: {
        fontSize: 20,
        marginTop: 10,
    },
    errorStyle: {
        color: 'red',
    },
    inputStyle: {
        borderWidth: 2,
        borderColor: 'skyblue',
        width: 250,
        paddingTop: 5,
        margin: 10,
        borderRadius: 10,
        paddingLeft: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    containerFooter: {
        bottom: 0,
        backgroundColor: '#7D9F3A',
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    imageFooter: {
        width: 60,
        height: 60,
    },
    loader: {
        flex:1,
    },
});
