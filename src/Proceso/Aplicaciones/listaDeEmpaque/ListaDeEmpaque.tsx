/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View, Modal } from "react-native";
import { Socket, io } from "socket.io-client";
import Header from "./components/Header";
import * as Keychain from "react-native-keychain";
import { predioType } from "../../../../types/predioType";
import { contenedoresType } from "../../../../types/contenedoresType";
import Pallets from "./components/Pallets";
import { cajasSinPalletType, itemType, settingsType } from "./types/types";
import { obtenerAccessToken, socketRequest } from "./controller/request";
import Footer from "./components/Footer";
import Informacion from "./components/Informacion";

let socket: Socket;

type propsType = {
    setSection: (e: string) => void
}

export const loteSeleccionadoContext = createContext<predioType>({
    enf: '',
    nombrePredio: '',
    tipoFruta: 'Limon' as 'Limon' | 'Naranja',
    _id: '',
    predio: '',
});
export const contenedoresContext = createContext<contenedoresType[]>([
    {
        _id: '',
        numeroContenedor: 0,
        pallets: [],
        infoContenedor: {
            clienteInfo: {
                CLIENTE: '',
                _id: '',
            },
            tipoFruta: 'Limon',
            cerrado: false,
            desverdizado: false,
            tipoCaja: [''],
            calibres: [''],
            calidad: [''],

        },
    },
]);
export const contenedorSeleccionadoContext = createContext<number>(-1);
export const palletSeleccionadoContext = createContext<number>(-1);
export const cajasSinPalletContext = createContext<cajasSinPalletType[]>([]);
export const itemSeleccionContext = createContext<number[]>([]);


export default function ListaDeEmpaque(props: propsType): React.JSX.Element {
    const [loteVaciando, setLoteVaciando] = useState<predioType>();
    const [contenedoresProvider, setContenedoresProvider] = useState<contenedoresType[]>([]);
    const [palletSeleccionado, setPalletSeleccionado] = useState<number>(-1);
    const [loteSeleccionado, setLoteSeleccionado] = useState<predioType>({
        enf: '',
        nombrePredio: '',
        tipoFruta: 'Limon' as 'Limon' | 'Naranja',
        _id: '',
        predio: '',
    });
    const [numeroContenedor, setNumeroContenedor] = useState<number>(-1);
    const [cajasSinPallet, setCajasSinPallet] = useState([]);
    const [seleccion, setSeleccion] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        createSocketConnection();
        obtenerPredioProcesando();
        obtenerContenedores();
        obtenerCajasSinPallet();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);
    const createSocketConnection = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error("Error no hay token de validadcion");
            }
            const { password } = credentials;
            const token = password;
            socket = io('ws://192.168.0.172:3011/', {
                auth: {
                    token: token,
                },
                rejectUnauthorized: false,
            });
            socket.on('connect', () => {
                console.log("Conectado a ws://192.168.0.172:3011/");
            });
            socket.on('connect_error', (error) => {
                Alert.alert(`Error en la conexion del socket: ${error}`);
            });
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        }
    };
    const obtenerPredioProcesando = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'obtener_predio_listaDeEmpaque' }, token: token };
            const response = await socketRequest(socket, request);
            setLoteVaciando(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const obtenerContenedores = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'obtener_contenedores_listaDeEmpaque' }, token: token };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const obtenerCajasSinPallet = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'obtener_cajas_sin_pallet' }, token: token };
            const response = await socketRequest(socket, request);
            setCajasSinPallet(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const guardarPalletSettings = async (settings: settingsType) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === numeroContenedor);
            const request = { data: { action: 'add_settings_pallet', _id: cont?._id, pallet: palletSeleccionado, settings: settings }, token: token };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
            Alert.alert("Guardado con exito");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const agregarItem = async (item: itemType) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === numeroContenedor);
            const request = {
                data: {
                    action: 'actualizar_pallet_contenedor',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    item: item,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
            Alert.alert("Guardado con exito");
            // console.log(response);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const eliminarItem = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === numeroContenedor);
            const request = {
                data: {
                    action: 'eliminar_item_lista_empaque',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    seleccion: seleccion,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
            Alert.alert("Eliminado con exito");
            // console.log(response);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const restarItem = async (item: any) => {
        try{
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === numeroContenedor);
            const request = {
                data: {
                    action: 'restar_item_lista_empaque',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    seleccion: seleccion[0],
                    cajas:item,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
            Alert.alert("Restado con exito");
        } catch(err){
            if(err instanceof Error){
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const moverItem = async (item:any) => {
        try{
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === numeroContenedor);
            const cont2 = contenedoresProvider.find(contenedor => contenedor.numeroContenedor === item.contenedor);
            const request = {
                data: {
                    action: 'mover_item_lista_empaque',
                    contenedor1:{
                        _id:cont?._id,
                        numeroContenedor:cont?.numeroContenedor,
                        pallet:palletSeleccionado,
                        seleccionado: seleccion,
                    },
                    contenedor2:{
                        _id:cont2 ? cont2._id : -1,
                        numeroContenedor:cont2 ? cont2.numeroContenedor : -1,
                        pallet:item.pallet,
                    },
                    cajas:item.numeroCajas,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setContenedoresProvider(response.data);
            if(Object.prototype.hasOwnProperty.call(response, 'cajasSinPallet')){
                setCajasSinPallet(response.cajasSinPallet);
            }
            Alert.alert("Se movió con exito");

        } catch(err){
            if(err instanceof Error){
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const agregarItemCajasSinPallet = async (item: itemType) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = {
                data: {
                    action: 'agregar_cajas_sin_pallet',
                    item: item,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setCajasSinPallet(response.data);
            Alert.alert("Guardado con exito");
            // console.log(response);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const eliminarItemCajasSinPallet = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = {
                data: {
                    action: 'eliminar_item_cajas_sin_pallet',
                    seleccion: seleccion,
                },
                token: token,
            };
            const response = await socketRequest(socket, request);
            setCajasSinPallet(response.data);
            Alert.alert("Eliminado con exito");
            // console.log(response);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    return (
        <contenedoresContext.Provider value={contenedoresProvider}>
            <loteSeleccionadoContext.Provider value={loteSeleccionado}>
                <contenedorSeleccionadoContext.Provider value={numeroContenedor}>
                    <palletSeleccionadoContext.Provider value={palletSeleccionado}>
                        <itemSeleccionContext.Provider value={seleccion}>

                            <cajasSinPalletContext.Provider value={cajasSinPallet}>
                                <SafeAreaView style={styles.container}>
                                    <Header
                                        setSection={props.setSection}
                                        setNumeroContenedor={setNumeroContenedor}
                                        loteVaciando={loteVaciando}
                                        seleccionarLote={setLoteSeleccionado} />
                                    <View style={styles.palletsInfoContainer}>
                                        <View>
                                            <Pallets
                                                agregarItemCajasSinPallet={agregarItemCajasSinPallet}
                                                guardarPalletSettings={guardarPalletSettings}
                                                setPalletSeleccionado={setPalletSeleccionado} />
                                        </View>
                                        <View style={styles.viewInformacion}>
                                            <Informacion setSeleccion={setSeleccion} />
                                        </View>
                                    </View>

                                    <Footer
                                        eliminarItemCajasSinPallet={eliminarItemCajasSinPallet}
                                        moverItem={moverItem}
                                        restarItem={restarItem}
                                        eliminarItem={eliminarItem}
                                        agregarItem={agregarItem} />
                                </SafeAreaView>

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={loading}>
                                    <View style={styles.centerModal}>
                                        <View style={styles.viewModal}>
                                            <View>
                                                <ActivityIndicator size="large" color="#00ff00" />
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            </cajasSinPalletContext.Provider>
                        </itemSeleccionContext.Provider>
                    </palletSeleccionadoContext.Provider>
                </contenedorSeleccionadoContext.Provider>
            </loteSeleccionadoContext.Provider>
        </contenedoresContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#719DF5',
        flex: 1,
        width: "100%",
    },
    palletsInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: 550,
    },
    viewInformacion: {
        minWidth: 400,
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 250,
        height:250,
        borderRadius: 20,
        shadowColor: '#52006A',
        elevation: 20,
        justifyContent:'center',
        alignItems:'center',
    },
});
