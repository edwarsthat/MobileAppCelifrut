
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { lotesType } from "../../../../types/lotesType";
import OrdenVaceoTarjetaPredio from "./components/OrdenVaceoTarjetaPredio";
import HorizontalLine from "../../../components/HorizontalLine";
import { useAppStore } from "../../../stores/useAppStore";



export default function OrdenVaceo(): React.JSX.Element {
    const { url } = useEnvContext();
    const setLoading = useAppStore((state) => state.setLoading);
    const [_, setLotesOriginal] = useState<lotesType[]>([]);
    const [lotesOrdenVaceo, setLotesOrdenVaceo] = useState<lotesType[]>([]);
    const [_1] = useState<number | null>(null);

    useEffect(() => {

        const obtenerData = async () => {
            try {
                setLoading(true);
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

                const nuevosLotes = responseLotes.data.filter(
                    (lote: lotesType) => !responseOrdenVaceo.data.includes(lote._id));
                setLotesOriginal(nuevosLotes);
                const nuevosLotesOrdenVaceo = responseOrdenVaceo.data.map(
                    (_id: string) => responseLotes.data.find(
                        (lote: lotesType) => lote._id === _id));
                setLotesOrdenVaceo(nuevosLotesOrdenVaceo);

            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(`Error ${err.name}: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };
        obtenerData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orden de vaceo</Text>
            <HorizontalLine />

            <>
                <FlatList
                    data={lotesOrdenVaceo}
                    keyExtractor={item => item._id}
                    renderItem={({ item, index }) => (
                        <OrdenVaceoTarjetaPredio
                            lote={item}
                            index={index}
                        />
                    )}
                    contentContainerStyle={styles.flatListContent}
                />
                </>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
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
