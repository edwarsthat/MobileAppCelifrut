import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Dimensions, Button, Alert, NativeModules, ActivityIndicator } from 'react-native';
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { CargoType } from '../../types/cargosType';
import useEnvContext from '../hooks/useEnvContext';
import { useAppStore } from '../stores/useAppStore';
const { ApkInstaller } = NativeModules;

type propsType = {
    setIslogin: (e: boolean) => void
    obtenerPermisos: (e: CargoType) => void
}

export default function Login(props: propsType): React.JSX.Element {
    const { url } = useEnvContext();
    const setLoading = useAppStore((state) => state.setLoading);
    const loading = useAppStore((state) => state.loading);
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
                console.error("[DEBUG] Error en checkForUpdates:", err);
                if (err instanceof Error) {
                    Alert.alert("Error de Conexión", `No se pudo conectar al servidor en ${url}. Verifica que el celular y la PC estén en la misma red Wi-Fi.`);
                }
            }
        };
        checkForUpdates();
    }, []);
    const handlelogin = async (): Promise<void> => {
        try {
            setLoading(true);
            console.log(url);

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
            console.log(response);
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

                props.setIslogin(true);
                props.obtenerPermisos(response.permisos);
                await Keychain.setGenericPassword('user', response.accesToken);
            }
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
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
        <Image style={styles.imgStyle} source={require('../../assets/logo_app.png')} />
        {isDownload ?
            <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
            :
            <>
                <View style={styles.container}>
                    <Text style={styles.title}>Iniciar Sesión</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Usuario"
                        value={user}
                        onChangeText={handleUser}
                    />
                    <Text style={styles.errorText}>
                        {error === 401 ? "Usuario incorrecto" : ""}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={(val) => {
                            setPassword(val);
                        }}
                    />
                    <Text style={styles.errorText}>
                        {error === 402 ? "Contraseña incorrecta" : ""}
                    </Text>

                    <Button disabled={loading} title="Ingresar" onPress={handlelogin} />
                </View>
            </>
        }

    </View>;
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    imgStyle: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: "contain",
    },
    formContainer: {
        width: "100%",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 12,
        borderRadius: 5,
        backgroundColor: "#fff",
        width: width * 0.8,

    },
    loader: {
        marginTop: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 8,
        textAlign: "center",
        fontWeight: "bold",
    },
});
