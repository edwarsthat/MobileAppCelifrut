/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext } from "../ListaDeEmpaque";
import PalletComponent from "./PalletComponent";
import { contenedoresType } from "../../../../../types/contenedoresType";
// import CajasSinPalletComponent from "./CajasSinPalletComponent";
import SettingsPallets from "./SettingsPallets";
import { itemType, settingsType } from "../types/types";
// import CajasSinPalletSetings from "./CajasSinPalletSetings";
import { deviceWidth } from "../../../../../App";

type propsType = {
    setPalletSeleccionado: (data: number) => void;
    guardarPalletSettings: (settings: settingsType) => Promise<void>;
    agregarItemCajasSinPallet: (data: itemType) => void
    liberarPallet: (item: any) => void
    setSeleccion: (e: number[]) => void
};

export default function Pallets(props: propsType): React.JSX.Element {
    const anchoDevice = useContext(deviceWidth);
    const contenedores = useContext(contenedoresContext);
    const idContenedor = useContext(contenedorSeleccionadoContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    // const [openModalSinPallet, setOpenModalSinPallet] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [data, setData] = useState<number[]>([]);
    const [columnas, setColumnas] = useState<number>(1);
    const [render, setRender] = useState<boolean>(false);
    const [contenedorSeleccionado, setContenedorSeleccionado] =
        useState<contenedoresType>({
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
                calibres: [],
                calidad: [],
                tipoCaja: [],
            },
        });
    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
        if (anchoDevice >= 721) {
            setColumnas(8);
        }
        const item = contenedores.find(cont => cont._id === idContenedor);

        if (item) {
            setContenedorSeleccionado(() => item);
            setData(() => Array.from({ length: contenedorSeleccionado.pallets.length }, (_, index) => index));
        }
    }, [idContenedor, contenedores, anchoDevice, contenedorSeleccionado]);
    const openPalletSettings = () => {
        setOpenModal(true);
    };
    const closeModal = (): void => {
        setOpenModal(false);
        setRender(!render);
    };
    const handleClickPallet = (e: number) => {
        props.setPalletSeleccionado(e);
        props.setSeleccion([]);
    };
    return (
        <View style={styles.view1}>
            <View style={isTablet ? idContenedor === "" ? styles.container2 : styles.container
                : idContenedor === "" ? stylesCel.container2 : stylesCel.container
            }>

                <FlatList
                    key={columnas}
                    data={data}
                    renderItem={({ item }) => (
                        <PalletComponent
                            render={render}
                            pallet={item}
                            handleClickPallet={handleClickPallet}
                            openPalletSettings={openPalletSettings}
                        />
                    )}
                    numColumns={columnas}
                />
                {/* <CajasSinPalletComponent
                    setPalletSeleccionado={props.setPalletSeleccionado}
                    setOpenModalSinPallet={setOpenModalSinPallet}
                /> */}
                <SettingsPallets
                    liberarPallet={props.liberarPallet}
                    guardarPalletSettings={props.guardarPalletSettings}
                    closeModal={closeModal}
                    openModal={openModal} />

                {/* <CajasSinPalletSetings
                    agregarItemCajasSinPallet={props.agregarItemCajasSinPallet}
                    openModalSinPallet={openModalSinPallet}
                    setOpenModalSinPallet={setOpenModalSinPallet} /> */}
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
        margin: 30,
        minHeight: 155,

    },
    container2: { minHeight: 525, width: '100%' },
});

const stylesCel = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: 100,
        flexWrap: 'wrap',
        margin: 30,
        minHeight: 155,
    },
    container2: { minHeight: 525, width: 90 },

});

