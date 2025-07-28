import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import { Socket, io } from "socket.io-client";
import Header from "./components/Header";
import { predioType, ResponseItem } from "../../../../types/predioType";
import { contenedoresType } from "../../../../types/contenedoresType";
import Pallets from "./components/Pallets";
import { cajasSinPalletType, itemType, settingsType } from "./types/types";
import { obtenerAccessToken, socketRequest } from "./controller/request";
import Footer from "./components/Footer";
import Informacion from "./components/Informacion";
import ResumenListaEmpaque from "./components/ResumenListaEmpaque";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../hooks/useAppContext";
import { validarAddItem, validarDeleteItems, validarModificarItem, validarMoverItem, validarRestarItem } from "./validations/validarRequest";
import useGetCatalogs from "../../../hooks/useGetCatalogs";
import { cuartosFriosType } from "../../../../types/catalogs";
import { validarEnviarCuartoFrioRequest } from "./controller/valiadations";
import { ZodError } from "zod";
import { getErrorMessages } from "../../../utils/errorsUtils";

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
export const contenedorSeleccionadoContext = createContext<string>("");
export const palletSeleccionadoContext = createContext<number>(-1);
export const cajasSinPalletContext = createContext<cajasSinPalletType[]>([]);
export const itemSeleccionContext = createContext<number[]>([]);


export default function ListaDeEmpaque(props: propsType): React.JSX.Element {
    const { url } = useEnvContext();
    const { obtenerCuartosFrios, cuartosFrios } = useGetCatalogs();
    const { setLoading, anchoDevice } = useAppContext();


    const [loteVaciando, setLoteVaciando] = useState<predioType[]>();
    const [contenedoresProvider, setContenedoresProvider] = useState<contenedoresType[]>([]);
    const [palletSeleccionado, setPalletSeleccionado] = useState<number>(-1);
    const [loteSeleccionado, setLoteSeleccionado] = useState<predioType>({
        enf: '',
        nombrePredio: '',
        tipoFruta: '',
        _id: '',
        predio: '',
    });
    const [idContenedor, setIdContenedor] = useState<string>("");
    const [seleccion, setSeleccion] = useState<number[]>([]);

    const [isTablet, setIsTablet] = useState<boolean>(false);

    const [showResumen, setShowResumen] = useState<boolean>(false);



    const createSocketConnection = useCallback(async () => {
        try {
            const token = await getCredentials();
            socket = io(`${url}/`, {
                auth: {
                    token: token,
                },
                rejectUnauthorized: false,
            });
            socket.on('connect', () => {
                console.log(`Conectado a ${url}/`);
            });
            socket.on('connect_error', (error) => {
                Alert.alert(`Error en la conexion del socket: ${error}`);
            });
            // socket.on('servidor', () => {
            //     obtenerPredioProcesando();
            // });
            socket.on('predio_vaciado', () => {
                obtenerPredioProcesando();
            });
            socket.on("listaempaque_update", () => {
                obtenerContenedores();
            });
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await obtenerCuartosFrios();
                setIsTablet(anchoDevice >= 721);
                createSocketConnection();
                await obtenerPredioProcesando();
                await obtenerContenedores();
            } catch (error) {
                Alert.alert('Error', 'No se pudieron obtener los datos iniciales');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [anchoDevice, createSocketConnection]);

    const obtenerPredioProcesando = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_proceso_aplicaciones_listaEmpaque_lotes' }, token: token };
            const response = await socketRequest(socket, request);
            if (response.status !== 200) {
                return Alert.alert(response.status + " Error obteniendo los predios");
            }
            const predios = response.data.map((item: ResponseItem) => {
                return ({
                    _id: item.documento._id,
                    enf: item.documento.enf,
                    nombrePredio: item.documento.predio.PREDIO,
                    predio: item.documento.predio._id,
                    tipoFruta: item.documento.tipoFruta,
                });
            });
            setLoteVaciando(predios);
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
            const request = { data: { action: 'get_proceso_aplicaciones_listaEmpaque_contenedores' }, token: token };
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
    const guardarPalletSettings = async (settings: settingsType) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = { data: { action: 'put_proceso_aplicaciones_listaEmpaque_addSettings', _id: cont?._id, pallet: palletSeleccionado, settings: settings }, token: token };
            await socketRequest(socket, request);
            Alert.alert("Guardado con exito ");
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
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_agregarItem',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    item: item,
                },
                token: token,
            };
            console.log(request);
            validarAddItem(request.data);
            await socketRequest(socket, request);
            // setContenedoresProvider(response.data);
            Alert.alert("Guardado con exito ");
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
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_eliminarItems',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    seleccion: seleccion,
                },
                token: token,
            };
            validarDeleteItems(request.data);
            await socketRequest(socket, request);
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
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_restarItem',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    seleccion: seleccion[0],
                    cajas: item,
                },
                token: token,
            };
            validarRestarItem(request.data);
            await socketRequest(socket, request);
            Alert.alert("Restado con exito");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const moverItem = async (item: any) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const cont2 = contenedoresProvider.find(contenedor => contenedor._id === item.contenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_moverItems',
                    contenedor1: {
                        _id: cont?._id,
                        numeroContenedor: cont?.numeroContenedor,
                        pallet: palletSeleccionado,
                        seleccionado: seleccion,
                    },
                    contenedor2: {
                        _id: cont2 ? cont2._id : "",
                        numeroContenedor: cont2 ? cont2.numeroContenedor : "",
                        pallet: item.pallet,
                    },
                    cajas: item.numeroCajas,
                },
                token: token,
            };
            validarMoverItem(request.data);
            await socketRequest(socket, request);
            Alert.alert("Se movió con exito");

        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const liberarPallet = async (item: any) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_liberarPallet',
                    item: item,
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                },
                token: token,
            };
            await socketRequest(socket, request);
            Alert.alert("Guardado con exito");
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
    const cerrarContenedor = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_Cerrar',
                    _id: cont?._id,
                },
                token: token,
            };
            await socketRequest(socket, request);

            const len = cont?.pallets.length;
            if (len) {
                for (let i = 0; i < len; i++) {
                    await AsyncStorage.removeItem(`${cont._id}:${i}`);
                }
            }


            Alert.alert("Guardado con exito");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const modificarItems = async (data: any) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_modificarItems',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    seleccion: seleccion,
                    data: data,
                },
                token: token,
            };
            validarModificarItem(request.data);
            await socketRequest(socket, request);
            Alert.alert("Guardado con exito");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.message}`);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const eviarPalletCuartoFrio = async (data: cuartosFriosType) => {
        try {
            console.log("Eviar pallet cuarto frio", data);
            setLoading(true);
            const token = await obtenerAccessToken();
            const cont = contenedoresProvider.find(contenedor => contenedor._id === idContenedor);
            const request = {
                data: {
                    action: 'put_inventarios_pallet_eviarCuartoFrio',
                    _id: cont?._id,
                    pallet: palletSeleccionado,
                    cuartoFrio: data,
                },
                token: token,
            };
            console.log(request);

            // Validar usando Zod con manejo de errores
            try {
                validarEnviarCuartoFrioRequest().parse(request.data);
            } catch (validationError) {
                if (validationError instanceof ZodError) {
                    const errorMessages = getErrorMessages(validationError);
                    const firstErrorKey = Object.keys(errorMessages)[0];
                    const firstErrorMessage = errorMessages[firstErrorKey as keyof typeof errorMessages];
                    Alert.alert("Error de validación", firstErrorMessage);
                    return; // Salir de la función sin hacer la petición
                }
                throw validationError; // Re-lanzar si no es un error de Zod
            }
            await socketRequest(socket, request);
            Alert.alert("Guardado con exito ");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleShowResumen = () => {
        setShowResumen(!showResumen);
    };
    return (
        <contenedoresContext.Provider value={contenedoresProvider}>
            <loteSeleccionadoContext.Provider value={loteSeleccionado}>
                <contenedorSeleccionadoContext.Provider value={idContenedor}>
                    <palletSeleccionadoContext.Provider value={palletSeleccionado}>
                        <itemSeleccionContext.Provider value={seleccion}>

                            <SafeAreaView style={styles.container}>
                                <Header
                                    eviarPalletCuartoFrio={eviarPalletCuartoFrio}
                                    cuartosFrios={cuartosFrios}
                                    setPalletSeleccionado={setPalletSeleccionado}
                                    showResumen={showResumen}
                                    handleShowResumen={handleShowResumen}
                                    cerrarContenendor={cerrarContenedor}
                                    setSection={props.setSection}
                                    setIdContenedor={setIdContenedor}
                                    loteVaciando={loteVaciando}
                                    isTablet={isTablet}
                                    seleccionarLote={setLoteSeleccionado} />

                                {showResumen ?
                                    <View style={isTablet ? styles.palletsInfoContainer : stylesCel.palletsInfoContainer}>
                                        <ResumenListaEmpaque />
                                    </View>
                                    :
                                    <View style={isTablet ? styles.palletsInfoContainer : stylesCel.palletsInfoContainer}>

                                        <Pallets
                                            setSeleccion={setSeleccion}
                                            isTablet={isTablet}
                                            liberarPallet={liberarPallet}
                                            guardarPalletSettings={guardarPalletSettings}
                                            setPalletSeleccionado={setPalletSeleccionado} />

                                        {isTablet &&
                                            <Informacion setSeleccion={setSeleccion} />}

                                    </View>
                                }
                                {isTablet &&
                                    <Footer
                                        modificarItems={modificarItems}
                                        moverItem={moverItem}
                                        restarItem={restarItem}
                                        eliminarItem={eliminarItem}
                                        agregarItem={agregarItem} />
                                }
                            </SafeAreaView>

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
        gap: 0,
        justifyContent: 'space-between',
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 250,
        height: 250,
        borderRadius: 20,
        shadowColor: '#52006A',
        elevation: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const stylesCel = StyleSheet.create({
    container: {
        backgroundColor: '#719DF5',
        flex: 1,
        width: "100%",
    },
    palletsInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: 390,
    },
    viewInformacion: {
        minWidth: 400,
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 250,
        height: 250,
        borderRadius: 20,
        shadowColor: '#52006A',
        elevation: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
