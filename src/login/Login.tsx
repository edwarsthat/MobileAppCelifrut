import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
    NativeModules,
    ActivityIndicator,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBlobUtil from 'react-native-blob-util';
import useEnvContext from '../hooks/useEnvContext';
import { useAppStore } from '../stores/useAppStore';
import { celifrut } from '../theme/celifrutTokens';
import useSessionStore from '../stores/useSessionStore';
const { ApkInstaller } = NativeModules;


export default function Login(): React.JSX.Element {
    const { url } = useEnvContext();
    const login = useSessionStore((s) => s.login);
    const setLoading = useAppStore((state) => state.setLoading);
    const loading = useAppStore((state) => state.loading);
    // Layout de dos columnas en tablet horizontal (= @media min-width:760 y min-aspect-ratio 5/4)
    const { width: winW, height: winH } = useWindowDimensions();
    const isWide = winW >= 760 && winW / winH >= 1.25;

    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(false);
    // const [remember, setRemember] = useState<boolean>(true);
    const [focused, setFocused] = useState<'user' | 'pass' | null>(null);
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        setVersion(DeviceInfo.getVersion());
        const checkForUpdates = async () => {
            try {
                const v = DeviceInfo.getVersion();
                const responseJSON = await fetch(`${url}/sistema/check_mobile_version`);
                const response = await responseJSON.json();
                const versionRemota = response?.data?.version;
                if (versionRemota && v !== versionRemota) {
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
        if (!user.trim() || !password.trim()) {
            setError('Ingresa usuario y contraseña.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        try {
            setLoading(true);
            setError('');
            await login(user, password, url)
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
            setError(mensaje);
            setTimeout(() => setError(''), 3000);
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

            const downloadDest = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${apkPath}`;

            const download = await ReactNativeBlobUtil.config({
                path: downloadDest,
            }).fetch('GET', `${url}/updates/mobile/${apkPath}`);

            if (download.respInfo.status !== 200) {
                throw new Error(`Error de descarga. Código de estado: ${download.respInfo.status}`);
            }

            await ApkInstaller.installApk(downloadDest);
            console.log('Instalación iniciada');

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert('Error', err.message);
            }
        } finally {
            setIsDownload(false);
        }
    };

    const errorMessage = error;

    if (isDownload) {
        return (
            <View style={styles.downloadScreen}>
                <ActivityIndicator size="large" color={celifrut.green} />
                <Text style={styles.downloadText}>Descargando actualización…</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.auth, isWide && styles.authWide]}>
                    {/* ---------- MARCA ---------- */}
                    <View style={[styles.brand, isWide && styles.brandWide]}>
                        {isWide && (
                            <>
                                <View style={[styles.glow, styles.glowTop]} />
                                <View style={[styles.glow, styles.glowBottom]} />
                            </>
                        )}
                        {isWide ? (
                            <View style={styles.logoChip}>
                                <Image
                                    style={styles.logoWide}
                                    source={require('../../assets/logo_celifrut.png')}
                                />
                            </View>
                        ) : (
                            <Image
                                style={styles.logo}
                                source={require('../../assets/logo_celifrut.png')}
                            />
                        )}
                        <Text style={[styles.appline, isWide && styles.applineWide]}>SISTEMA DE OPERACIONES</Text>
                    </View>

                    {/* ---------- TARJETA / FORMULARIO ---------- */}
                    <View style={[styles.card, isWide && styles.cardWide]}>
                        <Text style={[styles.title, isWide && styles.textLeft]}>Iniciar Sesión</Text>
                        <Text style={[styles.hint, isWide && styles.textLeft]}>Ingresa tus credenciales para continuar.</Text>

                        {!!errorMessage && (
                            <View style={styles.errorBox}>
                                <Feather name="alert-circle" size={16} color="#9A3416" />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        )}

                        {/* usuario */}
                        <View style={styles.field}>
                            <Text style={styles.label}>USUARIO</Text>
                            <View style={styles.control}>
                                <View style={styles.leadIcon}>
                                    <Feather name="user" size={19} color={celifrut.fg4} />
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focused === 'user' && styles.inputFocus,
                                    ]}
                                    placeholder="Usuario"
                                    placeholderTextColor={celifrut.fg4}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={user}
                                    onChangeText={handleUser}
                                    onFocus={() => setFocused('user')}
                                    onBlur={() => setFocused(null)}
                                />
                            </View>
                        </View>

                        {/* contraseña */}
                        <View style={styles.field}>
                            <Text style={styles.label}>CONTRASEÑA</Text>
                            <View style={styles.control}>
                                <View style={styles.leadIcon}>
                                    <Feather name="lock" size={19} color={celifrut.fg4} />
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.inputWithEye,
                                        focused === 'pass' && styles.inputFocus,
                                    ]}
                                    placeholder="Contraseña"
                                    placeholderTextColor={celifrut.fg4}
                                    secureTextEntry={!showPass}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocused('pass')}
                                    onBlur={() => setFocused(null)}
                                />
                                <Pressable
                                    style={styles.eyeBtn}
                                    onPress={() => setShowPass((s) => !s)}
                                    hitSlop={8}
                                >
                                    <Feather name={showPass ? 'eye-off' : 'eye'} size={20} color={celifrut.fg4} />
                                </Pressable>
                            </View>
                        </View>

                        {/* fila: mantener sesión + olvidé */}
                        <View style={styles.row}>
                            {/* <Pressable style={styles.check} onPress={() => setRemember((r) => !r)} hitSlop={6}>
                                <View style={[styles.checkBox, remember && styles.checkBoxOn]}>
                                    {remember && <Feather name="check" size={12} color="#FFFFFF" />}
                                </View>
                                <Text style={styles.checkLabel}>Mantener sesión</Text>
                            </Pressable> */}
                            <Pressable hitSlop={6}>
                                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                            </Pressable>
                        </View>

                        {/* botón */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.submit,
                                pressed && styles.submitPressed,
                                loading && styles.submitDisabled,
                            ]}
                            onPress={handlelogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <Text style={styles.submitText}>INGRESANDO…</Text>
                                </>
                            ) : (
                                <Text style={styles.submitText}>INGRESAR</Text>
                            )}
                        </Pressable>

                        {/* meta */}
                        <View style={[styles.meta, isWide && styles.metaWide]}>
                            {/* <Text style={[styles.metaText, isWide && styles.textLeft]}>
                                ¿Problemas para entrar? Contacta a{' '}
                                <Text style={styles.metaStrong}>soporte@celifrut.com</Text>
                            </Text> */}
                            <Text style={styles.metaVer}>V-{version}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, width: '100%', alignSelf: 'stretch' },
    screen: { flex: 1, backgroundColor: celifrut.cream },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 28,
    },
    auth: { width: '100%', maxWidth: 440 },
    authWide: {
        maxWidth: 880,
        flexDirection: 'row',
        backgroundColor: celifrut.paper,
        borderWidth: 1,
        borderColor: celifrut.borderSoft,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#4E2810',
        shadowOpacity: 0.14,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 16 },
    },

    downloadScreen: {
        flex: 1,
        backgroundColor: celifrut.cream,
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadText: { marginTop: 16, fontSize: 14, color: celifrut.fg3 },

    /* ---------- MARCA ---------- */
    brand: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 210, height: 112, resizeMode: 'contain' },
    appline: {
        marginTop: 14,
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 1.8,
        color: celifrut.greenDark,
    },
    // --- variantes tablet (dos columnas) ---
    brandWide: {
        flex: 1,
        marginBottom: 0,
        paddingVertical: 64,
        paddingHorizontal: 60,
        backgroundColor: celifrut.green,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    glow: { position: 'absolute', borderRadius: 999 },
    glowTop: {
        width: 360,
        height: 360,
        top: -120,
        left: -120,
        backgroundColor: celifrut.greenSoft,
        opacity: 0.45,
    },
    glowBottom: {
        width: 320,
        height: 320,
        bottom: -110,
        right: -90,
        backgroundColor: celifrut.greenDark,
        opacity: 0.5,
    },
    logoChip: {
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 22,
        paddingVertical: 22,
        paddingHorizontal: 26,
        elevation: 6,
        shadowColor: '#4E2810',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    logoWide: { width: 200, height: 108, resizeMode: 'contain' },
    applineWide: { color: '#FFFFFF', opacity: 0.92, marginTop: 22 },
    textLeft: { textAlign: 'left' },

    /* ---------- TARJETA ---------- */
    card: {
        backgroundColor: celifrut.paper,
        borderWidth: 1,
        borderColor: celifrut.borderSoft,
        borderRadius: 22,
        paddingHorizontal: 26,
        paddingTop: 30,
        paddingBottom: 30,
        elevation: 6,
        shadowColor: '#4E2810',
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 14 },
    },
    cardWide: {
        flex: 1.05,
        borderWidth: 0,
        borderRadius: 0,
        paddingHorizontal: 54,
        paddingVertical: 52,
        justifyContent: 'center',
        elevation: 0,
        shadowOpacity: 0,
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        color: celifrut.brown,
        textAlign: 'center',
    },
    hint: {
        marginTop: 8,
        marginBottom: 24,
        fontSize: 14,
        color: celifrut.fg3,
        textAlign: 'center',
    },

    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        marginBottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(192,66,28,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(192,66,28,0.25)',
        borderRadius: 8,
    },
    errorText: { color: '#9A3416', fontSize: 13.5, fontWeight: '600', flexShrink: 1 },

    field: { marginBottom: 16 },
    label: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.4,
        color: celifrut.brownSoft,
        marginBottom: 8,
    },
    control: { position: 'relative', justifyContent: 'center' },
    leadIcon: { position: 'absolute', left: 15, zIndex: 1 },
    input: {
        height: 54,
        backgroundColor: celifrut.sand50,
        borderWidth: 1.5,
        borderColor: celifrut.borderMedium,
        borderRadius: 14,
        paddingLeft: 46,
        paddingRight: 16,
        fontSize: 16,
        color: celifrut.fg2,
    },
    inputWithEye: { paddingRight: 50 },
    inputFocus: {
        borderColor: celifrut.green,
        backgroundColor: '#FFFFFF',
    },
    eyeBtn: {
        position: 'absolute',
        right: 9,
        width: 38,
        height: 38,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 4,
        marginBottom: 24,
    },
    check: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: celifrut.borderStrong,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBoxOn: { backgroundColor: celifrut.green, borderColor: celifrut.green },
    checkLabel: { fontSize: 13.5, color: celifrut.fg3 },
    link: { fontSize: 13.5, fontWeight: '700', color: celifrut.greenDark },

    submit: {
        height: 56,
        borderRadius: 999,
        backgroundColor: celifrut.green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        elevation: 5,
        shadowColor: celifrut.greenDark,
        shadowOpacity: 0.32,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    submitPressed: { transform: [{ translateY: 2 }], elevation: 2 },
    submitDisabled: { opacity: 0.7 },
    submitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.4 },

    meta: { marginTop: 24, alignItems: 'center' },
    metaWide: { alignItems: 'flex-start' },
    metaText: { fontSize: 12, color: celifrut.fg4, textAlign: 'center' },
    metaStrong: { color: celifrut.brownSoft, fontWeight: '700' },
    metaVer: {
        marginTop: 6,
        fontSize: 11,
        color: celifrut.fg4,
        letterSpacing: 0.4,
        fontFamily: Platform.select({ android: 'monospace', ios: 'Menlo' }),
    },
});
