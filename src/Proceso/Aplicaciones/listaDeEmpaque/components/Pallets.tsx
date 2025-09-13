import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import PalletComponent from "./PalletComponent";
import SettingsPallets from "./SettingsPallets";
import { PalletAsyncData, settingsType } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { useAppStore } from "../../../../stores/useAppStore";
import { cuartosFriosType } from "../../../../../types/catalogs";

type propsType = {
    guardarPalletSettings: (settings: settingsType, itemCalidad: any) => Promise<void>;
    isTablet: boolean
    enviarCajasCuartoFrio: (cuarto: cuartosFriosType, items: string[]) => Promise<void>;
};

export default function Pallets({
    isTablet, guardarPalletSettings, enviarCajasCuartoFrio,
}: propsType): React.JSX.Element {
    const setLoading = useAppStore(state => state.setLoading);
    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const palletSeleccionado = useListaDeEmpaqueStore(state => state.seleccionarPallet);
    const setSeleccion = useListaDeEmpaqueStore(state => state.setSeleccion);
    const setEF1_id = useListaDeEmpaqueStore(state => state.setEF1_id);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [columnas, setColumnas] = useState<number>(1);

    const [palletsAsyncData, setPalletsAsyncData] = useState<({ [key: number]: PalletAsyncData })>({});

    const data = contenedor?.pallets.map((_, idx) => idx) || [];

    useEffect(() => {
        if (isTablet) {
            setColumnas(6);
        } else {
            setColumnas(2);
        }
    }, [isTablet]);

    useEffect(() => {
        let mounted = true;
        const fetchAllPalletsData = async () => {
            try {
                setLoading(true);
                // Construimos todas las promesas de lectura
                if (!contenedor) { return; }

                const results = await Promise.all(
                    contenedor.pallets.map(async (palletNumber, index) => {
                        const value = await AsyncStorage.getItem(`${contenedor._id}:${index}`);
                        const color = await AsyncStorage.getItem(`${contenedor._id}:${index}:color`);
                        return {
                            pallet: index,
                            cajasContadas: value ?? '',
                            selectedColor: color ?? '#FFFFFF',
                        };
                    })
                );

                // Convertimos a un objeto indexado por número de pallet
                const dataObj: { [key: number]: { cajasContadas: string; selectedColor: string } } = {};
                results.forEach(result => {
                    dataObj[result.pallet] = {
                        cajasContadas: result.cajasContadas,
                        selectedColor: result.selectedColor,
                    };
                });
                if (mounted) { setPalletsAsyncData(dataObj); }
            } catch (error) {
                Alert.alert("Error", "No se pudo obtener la información de los pallets.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllPalletsData();
        return () => { mounted = false; };
    }, [contenedor]);

    const openPalletSettings = () => {
        setOpenModal(true);
    };
    const closeModal = (): void => {
        setOpenModal(false);
    };
    const handleClickPallet = (e: number) => {
        palletSeleccionado(e);
        setSeleccion([]);
        setEF1_id([]);
    };
    return (
        <View style={styles.view1}>
            <View style={styles.container}>

                <FlatList
                    key={columnas}
                    data={data}
                    keyExtractor={(item) => item.toString()}
                    initialNumToRender={20}
                    renderItem={({ item, index }) => (
                        <PalletComponent
                            palletsAsyncData={palletsAsyncData[index] || { cajasContadas: '', selectedColor: '#FFFFFF' }}
                            numeroPallet={item}
                            handleClickPallet={handleClickPallet}
                            openPalletSettings={openPalletSettings}
                        />
                    )}
                    numColumns={columnas}
                />

                <SettingsPallets
                    enviarCajasCuartoFrio={enviarCajasCuartoFrio}
                    isTablet={isTablet}
                    guardarPalletSettings={guardarPalletSettings}
                    closeModal={closeModal}
                    openModal={openModal} />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    view1: {
        width: "75%",
    },
    container: {
        display: 'flex',
        flexDirection: 'row',

        width: "100%",
        margin: 5,
        minHeight: 155,

    },
});



