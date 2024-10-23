/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { lotesType } from "../../../../types/lotesType";
import OrdenVaceoTarjetaPredio from "./components/OrdenVaceoTarjetaPredio";
import HorizontalLine from "../../../components/HorizontalLine";
import { Socket, io } from "socket.io-client";
import OrdenVaceoInventario from "./components/OrdenVaceoInventario";

let socket: Socket;


export default function OrdenVaceo(): React.JSX.Element {
    const { url, socketURL } = useEnvContext();
    const [lotes, setLotes] = useState<lotesType[]>();
    const [ordenVaceo, setOrdenVaceo] = useState<string[]>([]);
    const [_, setLotesOriginal] = useState<lotesType[]>([]);
    const [lotesOrdenVaceo, setLotesOrdenVaceo] = useState<lotesType[]>([]);
    const [showInventario, setrShowInventario] = useState<boolean>(false);
    const [_1, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const crear_conexion_de_eventos = async () => {
            try {
                const token = await getCredentials();
                socket = io(`${socketURL}:3011/`, {
                    auth: {
                        token: token,
                    },
                    rejectUnauthorized: false,
                });
                socket.on('connect', () => {
                    console.log(`Conectado a ${socketURL}:3011/`);
                });
                socket.on('connect_error', (error) => {
                    Alert.alert(`Error en la conexion del socket: ${error}`);
                });
                socket.on('orden_vaceo_update', () => {
                    obtenerData();
                });
            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(err.message);
                }
            }
        };
        const obtenerData = async () => {
            try {
                const token = await getCredentials();
                const requestLotes = await fetch(`${url}/proceso/getInventario_orden_vaceo`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `${token}`,
                    },
                });
                const responseLotes = await requestLotes.json();
                if (responseLotes.status !== 200) {
                    throw new Error(`Cose ${responseLotes.status}: ${responseLotes.message}`);
                }
                const requesOrdenVaceo = await fetch(`${url}/proceso/getOrdenVaceo`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `${token}`,
                    },
                });
                const responseOrdenVaceo = await requesOrdenVaceo.json();
                if (responseOrdenVaceo.status !== 200) {
                    throw new Error(`Cose ${responseOrdenVaceo.status}: ${responseOrdenVaceo.message}`);
                }
                setOrdenVaceo(responseOrdenVaceo.data);

                const nuevosLotes = responseLotes.data.filter(
                    (lote: lotesType) => !responseOrdenVaceo.data.includes(lote._id));
                setLotes(nuevosLotes);
                setLotesOriginal(nuevosLotes);
                const nuevosLotesOrdenVaceo = responseOrdenVaceo.data.map(
                    (_id: string) => responseLotes.data.find(
                        (lote: lotesType) => lote._id === _id));
                setLotesOrdenVaceo(nuevosLotesOrdenVaceo);

            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(`Error ${err.name}: ${err.message}`);
                }
            }
        };
        crear_conexion_de_eventos();
        obtenerData();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);
    const handleChangeOrdenVaceo = async (index: number, newIndex: number) => {
        if (lotes !== undefined) {
            // console.log(index);
            // console.log(newIndex);
            if (newIndex > ordenVaceo.length) {
                newIndex = ordenVaceo.length - 1;
            } else if (newIndex < 0){
                newIndex = 0;
            }
            const result = [...ordenVaceo];
            const [removed] = result.splice(index, 1);
            result.splice(newIndex, 0, removed);
            await socket_request(result);
        }
    };
    const handleVerInventario = () => {
        setrShowInventario(!showInventario);
    };
    const add_to_ordenVaceo = async (id: string) => {
        const newOrden = [...ordenVaceo, id];
        await socket_request(newOrden);
    };
    const socket_request = async (data:string[]) => {
        try {
            const token = await getCredentials();
            const request = {
                data: {
                    data: data,
                    action: 'addOrdenDeVaceo',
                }, token: token,
            };
            const response: { status: number, data: object, token: string } = await new Promise((resolve) => {
                socket.emit('Desktop2', request, (serverResponse: any) => {
                    resolve(serverResponse);
                });
            });
            return response;
        } catch (e) {
            if (e instanceof Error) {
                Alert.alert(e.message);
            }
        }
    };
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };
    const handleDragEnd = () => {
        setDraggedIndex(null);
        // Aquí podrías llamar a socket_request con el orden actual si no lo hiciste en handleChangeOrdenVaceo
        socket_request(ordenVaceo);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orden de vaceo</Text>
            <Button title={showInventario ? "Orden de vaceo" : "Inventario"} onPress={handleVerInventario} />
            <HorizontalLine />

            {showInventario ?
                <>

                    <FlatList
                        data={lotes}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <OrdenVaceoInventario
                                add_to_ordenVaceo={add_to_ordenVaceo}
                                data={item}
                            />
                        )}
                        contentContainerStyle={styles.flatListContent}
                    />
                </>
                :
                <>
                    <Button title="Vacear" color="green" />

                    <FlatList
                        data={lotesOrdenVaceo}
                        keyExtractor={item => item._id}
                        renderItem={({ item, index }) => (
                            <OrdenVaceoTarjetaPredio
                                handleDragEnd={handleDragEnd}
                                handleDragStart={handleDragStart}
                                lote={item}
                                index={index}
                                handleChangeOrdenVaceo={handleChangeOrdenVaceo}
                            />
                        )}
                        contentContainerStyle={styles.flatListContent}
                    /></>
            }





        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContent: {
        flexGrow: 1,
    },
    loader: {
        marginTop: 250,
    },
    title: {
        width: '100%',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    viewBotones: {
        flex: 1,
        flexDirection: "row",
        gap: 10,

    },
});
