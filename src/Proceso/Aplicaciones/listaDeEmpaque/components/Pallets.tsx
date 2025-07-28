import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext } from "../ListaDeEmpaque";
import PalletComponent from "./PalletComponent";
import SettingsPallets from "./SettingsPallets";
import { PalletAsyncData, settingsType } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../../hooks/useAppContext";
import { CONTENEDOR_VACIO } from "../constants/configs";

type propsType = {
    setPalletSeleccionado: (data: number) => void;
    guardarPalletSettings: (settings: settingsType) => Promise<void>;
    liberarPallet: (item: any) => void
    setSeleccion: (e: number[]) => void
    isTablet: boolean

};

export default function Pallets(props: propsType): React.JSX.Element {
    const { setLoading } = useAppContext();
    const contenedores = useContext(contenedoresContext);
    const idContenedor = useContext(contenedorSeleccionadoContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [columnas, setColumnas] = useState<number>(1);

    const [palletsAsyncData, setPalletsAsyncData] = useState<({ [key: number]: PalletAsyncData })>({});
    const contenedorSeleccionado = contenedores.find(cont => cont._id === idContenedor) ?? CONTENEDOR_VACIO;
    const data = contenedorSeleccionado?.pallets.map((_, idx) => idx) || [];

    useEffect(() => {
        if (props.isTablet) {
            setColumnas(6);
        } else {
            setColumnas(2);
        }
    }, [props.isTablet]);

    useEffect(() => {
        let mounted = true;
        const fetchAllPalletsData = async () => {
            try {
                setLoading(true);
                // Construimos todas las promesas de lectura
                const results = await Promise.all(
                    contenedorSeleccionado.pallets.map(async (palletNumber, index) => {
                        const value = await AsyncStorage.getItem(`${contenedorSeleccionado._id}:${index}`);
                        const color = await AsyncStorage.getItem(`${contenedorSeleccionado._id}:${index}:color`);
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
    }, [contenedorSeleccionado]);

    const openPalletSettings = () => {
        setOpenModal(true);
    };
    const closeModal = (): void => {
        setOpenModal(false);
    };
    const handleClickPallet = (e: number) => {
        props.setPalletSeleccionado(e);
        props.setSeleccion([]);
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
                            pallet={item}
                            handleClickPallet={handleClickPallet}
                            openPalletSettings={openPalletSettings}
                        />
                    )}
                    numColumns={columnas}
                />

                <SettingsPallets
                    liberarPallet={props.liberarPallet}
                    isTablet={props.isTablet}
                    guardarPalletSettings={props.guardarPalletSettings}
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



