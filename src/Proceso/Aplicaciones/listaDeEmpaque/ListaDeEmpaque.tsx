import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import Header from "./components/Header";
import { predioType, ResponseItem } from "../../../../types/predioType";
import { contenedoresType } from "../../../../types/contenedores/contenedoresType";
import Pallets from "./components/Pallets";
import { itemType, settingsType } from "./types/types";
import { obtenerAccessToken } from "./controller/request";
import Footer from "./components/Footer";
import Informacion from "./components/Informacion";
import ResumenListaEmpaque from "./components/ResumenListaEmpaque";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../hooks/useAppContext";
import { validarAddItem, validarDeleteItems, validarEnviarCuartoFio, validarModificarItem, validarMoverItem, validarRestarItem } from "./validations/validarRequest";

import { useAppStore } from "../../../stores/useAppStore";
import { useListaDeEmpaqueStore } from "./store/useListaDeEmpaqueStore";
import { useSocketStore } from "../../../stores/useSocketStore";
import { cuartosFriosType } from "../../../../types/catalogs";
import { palletsType } from "../../../../types/contenedores/palletsType";
import { itemPalletType } from "../../../../types/contenedores/itemsPallet";

type propsType = {
    setSection: (e: string) => void
}

export default function ListaDeEmpaque(props: propsType): React.JSX.Element {
    const { anchoDevice } = useAppContext();
    const setLoading = useAppStore((state) => state.setLoading);
    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const seleccinarContenedor = useListaDeEmpaqueStore(state => state.seleccionarContenedor);
    const pallet = useListaDeEmpaqueStore(state => state.pallet);
    const seleccion = useListaDeEmpaqueStore(state => state.seleccion);
    const setSeleccion = useListaDeEmpaqueStore(state => state.setSeleccion);
    const socketRequest = useSocketStore(state => state.sendRequest);
    const lastMessage = useSocketStore((state) => state.lastMessage);
    const setCuartosFriosInventario = useListaDeEmpaqueStore(state => state.setCuartosFriosInventario);
    const setCuartosFrios = useListaDeEmpaqueStore(state => state.setCuartosFrios);
    const setEF1_id = useListaDeEmpaqueStore(state => state.setEF1_id);

    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    const [pallets, setPallets] = useState<palletsType[]>([]);
    const [itemsPallet, setItemsPallet] = useState<itemPalletType[]>([]);
    const [loteVaciando, setLoteVaciando] = useState<predioType[]>();
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [showResumen, setShowResumen] = useState<boolean>(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setIsTablet(anchoDevice >= 721);
                await obtenerPredioProcesando();
                await obtenerContenedores();
                await obtenerInventarioCuartosFrios();
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron obtener los datos iniciales');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [anchoDevice]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (lastMessage?.event === 'predio_vaciado') {
                    await obtenerPredioProcesando();
                } else if (lastMessage?.event === 'listaempaque_update') {
                    await obtenerContenedores();
                    if (contenedor?._id) {
                        await obtenerPallets(contenedor?._id || "");
                        await obtenerItemsPallet(contenedor?._id || "");
                    }

                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron obtener los datos iniciales');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lastMessage]);
    useEffect(() => {
        const cont = contenedores.find(c => c._id === contenedor?._id);
        if (cont) {
            seleccinarContenedor(cont);
        }
    }, [contenedores]);

    const obtenerPredioProcesando = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_proceso_aplicaciones_listaEmpaque_lotes' }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                return Alert.alert(response.status + " Error obteniendo los predios");
            }
            const predios = response.data.map((item: any) => {
                return ({
                    _id: item.loteId._id,
                    enf: item.loteId.enf,
                    tipoFruta: item.tipoFruta,
                    nombrePredio: item.predio.PREDIO,
                    predio: item.predio._id,
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
            const response = await socketRequest(request);
            if (response.status !== 200) {
                return Alert.alert(response.status + " Error obteniendo los contenedores");
            }
            const newObjt = JSON.parse(JSON.stringify(response.data));
            setContenedores(newObjt);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const obtenerPallets = async (id: string) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_proceso_aplicaciones_listaEmpaque_pallets', contenedor: id }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al obtener los pallets: ${response.message}`);
            }
            setPallets(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const obtenerItemsPallet = async (id: string) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_proceso_aplicaciones_listaEmpaque_itemsPallet', contenedor: id }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al obtener los items del pallet: ${response.message}`);
            }
            console.log("Items del pallet obtenidos: ", response.data.length);
            setItemsPallet(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const guardarPalletSettings = async (settings: settingsType, itemCalidad: any) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            if (!contenedor) {
                return Alert.alert("No hay contenedor seleccionado");
            }
            const palletItem = pallets.find(p => p.numeroPallet === Number(pallet));
            if (!pallet) {
                return Alert.alert("No hay pallet seleccionado");
            }
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_addSettings',
                    _id: palletItem?._id,
                    settings: settings,
                    itemCalidad: itemCalidad,
                },
                token: token,
            };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al guardar la configuración del pallet: ${response.message}`);
            }
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
            const palletInfo = pallets.find(p => p.numeroPallet === Number(pallet));
            console.log("Item a agregar: ", item);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_agregarItem',
                    _id: contenedor?._id,
                    pallet: palletInfo?._id,
                    item: item,
                },
                token: token,
            };
            console.log("Request agregar item: ", request);
            validarAddItem(request.data);
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al agregar el item: ${response.message}`);
            }
            Alert.alert("Guardado con exito ");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setSeleccion([]);
            setLoading(false);
        }
    };
    const eliminarItem = async () => {
        try {
            setLoading(true);

            const token = await obtenerAccessToken();
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_eliminarItems',
                    _id: contenedor?._id,
                    pallet: pallet,
                    seleccion: seleccion,
                },
                token: token,
            };
            validarDeleteItems(request.data);
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al eliminar los items: ${response.message}`);
            }
            Alert.alert("Eliminado con exito");
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
            const palletItem = itemsPallet.find(p => p._id === seleccion[0]);
            console.log("Pallet item a restar: ", palletItem?._id);
            if (!palletItem) { throw new Error("Item no encontrado"); }
            const token = await obtenerAccessToken();
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_restarItem',
                    _id: palletItem._id,
                    cajas: item,
                },
                token: token,
            };
            validarRestarItem(request.data);
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al restar el item: ${response.message}`);
            }
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
            const cont2 = contenedores.find(cont => cont._id === item.contenedor);
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_moverItems',
                    seleccionado: seleccion,
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
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al mover el item: ${response.message}`);
            }
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
    const cerrarContenedor = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_Cerrar',
                    _id: contenedor?._id,
                },
                token: token,
            };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al cerrar el contenedor: ${response.message}`);
            }
            const len = contenedor?.pallets;
            if (len) {
                for (let i = 0; i < len; i++) {
                    await AsyncStorage.removeItem(`${contenedor._id}:${i}`);
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
            const request = {
                data: {
                    action: 'put_proceso_aplicaciones_listaEmpaque_modificarItems',
                    seleccion: seleccion,
                    data: data,
                },
                token: token,
            };
            validarModificarItem(request.data);
            const response = await socketRequest(request);
            if (response.status !== 200) {
                throw new Error(`Error al modificar items: ${response.message}`);
            }
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
    const obtenerInventarioCuartosFrios = async () => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const request = { data: { action: 'get_inventarios_cuartosFrios_listaEmpaque' }, token: token };
            const response = await socketRequest(request);
            if (response.status !== 200) {
                return Alert.alert(response.status + " Error obteniendo los cuartos frios");
            }
            setCuartosFriosInventario(response.data.inventarioTotal);
            setCuartosFrios(response.data.infoCuartos);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const enviarCajasCuartoFrio = async (cuarto: cuartosFriosType, seleccionItems: string[]) => {
        try {
            setLoading(true);
            const token = await obtenerAccessToken();
            const data = {
                seleccion: seleccionItems,
                cuartoFrio: cuarto._id,
            };
            validarEnviarCuartoFio(data);
            const request = {
                action: "put_inventarios_pallet_eviarCuartoFrio",
                data: data,
            };
            const response = await socketRequest({ data: request, token: token });

            if (response.status !== 200) {
                throw new Error("No se pudo enviar el pallet al cuarto frío. Intente nuevamente.");
            }
            Alert.alert("Éxito", "Pallet enviado al cuarto frío correctamente.");
            setEF1_id([]);
            await obtenerInventarioCuartosFrios();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error adding pallet:", error);
                Alert.alert("Error", error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleShowResumen = () => {
        setShowResumen(!showResumen);
    };
    return (

        <SafeAreaView style={styles.container}>
            <Header
                obtenerItemsPallet={obtenerItemsPallet}
                obtenerPallets={obtenerPallets}
                enviarCajasCuartoFrio={enviarCajasCuartoFrio}
                setSection={props.setSection}
                isTablet={isTablet}
                contenedores={contenedores}
                loteVaciando={loteVaciando}
                showResumen={showResumen}
                handleShowResumen={handleShowResumen}
                cerrarContenendor={cerrarContenedor}
            />

            {showResumen ?
                <View style={isTablet ? styles.palletsInfoContainer : stylesCel.palletsInfoContainer}>
                    <ResumenListaEmpaque itemPallets={itemsPallet} contenedores={contenedores} />
                </View>
                :
                <View style={isTablet ? styles.palletsInfoContainer : stylesCel.palletsInfoContainer}>

                    <Pallets
                        itemsPallet={itemsPallet}
                        pallets={pallets}
                        enviarCajasCuartoFrio={enviarCajasCuartoFrio}
                        isTablet={isTablet}
                        guardarPalletSettings={guardarPalletSettings}
                    />

                    {isTablet &&
                        <Informacion pallets={pallets} itemsPallet={itemsPallet} setSeleccion={setSeleccion} />}

                </View>

            }
            {isTablet &&
                <Footer
                    palletsItems={itemsPallet}
                    pallets={pallets}
                    contenedores={contenedores}
                    modificarItems={modificarItems}
                    moverItem={moverItem}
                    restarItem={restarItem}
                    eliminarItem={eliminarItem}
                    agregarItem={agregarItem} />
            }
        </SafeAreaView>
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
