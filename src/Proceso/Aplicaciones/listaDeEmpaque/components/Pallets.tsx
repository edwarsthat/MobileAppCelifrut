import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import PalletComponent from "./PalletComponent";
import SettingsPallets from "./SettingsPallets";
import { PalletAsyncData, settingsType } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { useAppStore } from "../../../../stores/useAppStore";
import { cuartosFriosType } from "../../../../../types/catalogs";
import { palletsType } from "../../../../../types/contenedores/palletsType";
import { itemPalletType } from "../../../../../types/contenedores/itemsPallet";

type propsType = {
    guardarPalletSettings: (settings: settingsType, itemCalidad: any) => Promise<void>;
    isTablet: boolean;
    enviarCajasCuartoFrio: (cuarto: cuartosFriosType, items: string[]) => Promise<void>;
    pallets: palletsType[];
    itemsPallet: itemPalletType[];
};

export default function Pallets({
    isTablet, guardarPalletSettings, enviarCajasCuartoFrio, pallets, itemsPallet,
}: propsType): React.JSX.Element {
    const setLoading = useAppStore(state => state.setLoading);
    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const palletSeleccionado = useListaDeEmpaqueStore(state => state.seleccionarPallet);
    const setSeleccion = useListaDeEmpaqueStore(state => state.setSeleccion);
    const setEF1_id = useListaDeEmpaqueStore(state => state.setEF1_id);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [columnas, setColumnas] = useState<number>(1);

    const [palletsAsyncData, setPalletsAsyncData] = useState<({ [key: number]: PalletAsyncData })>({});

    // const data = contenedor?.pallets.map((_, idx) => idx) || [];

    useEffect(() => {
        if (isTablet) {
            setColumnas(5);
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
                if (!pallets) { return; }
                if (!contenedor) { return; }

                const results = await Promise.all(
                    pallets.map(async (palletNumber) => {
                        const value = await AsyncStorage.getItem(`${contenedor._id}:${palletNumber.numeroPallet}`);
                        const color = await AsyncStorage.getItem(`${contenedor._id}:${palletNumber.numeroPallet}:color`);
                        return {
                            pallet: Number(palletNumber.numeroPallet),
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
    }, [contenedor, openModal]);

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
        const palletInfo = pallets.find(p => p.numeroPallet === e);
        if (!palletInfo) {
            Alert.alert("Error", "Pallet no encontrado");
            return;
        }
    };
    return (
        <View style={styles.view1}>
            <View style={styles.container}>

                <FlatList
                    key={columnas}
                    data={pallets}
                    keyExtractor={(item) => item._id.toString()}
                    initialNumToRender={20}
                    renderItem={({ item }) => (
                        <PalletComponent
                            palletsAsyncData={palletsAsyncData[item.numeroPallet] || { cajasContadas: '', selectedColor: '#FFFFFF' }}
                            numeroPallet={Number(item.numeroPallet)}
                            handleClickPallet={handleClickPallet}
                            openPalletSettings={openPalletSettings}
                            pallet={item}
                            itemsPallet={itemsPallet}
                        />
                    )}
                    numColumns={columnas}
                />

                <SettingsPallets
                    itemsPallet={itemsPallet}
                    pallets={pallets}
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



