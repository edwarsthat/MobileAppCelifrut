/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext } from "../ListaDeEmpaque";
import PalletComponent from "./PalletComponent";
import { contenedoresType } from "../../../../../types/contenedoresType";
import CajasSinPalletComponent from "./CajasSinPalletComponent";
import SettingsPallets from "./SettingsPallets";
import { itemType, settingsType } from "../types/types";
import CajasSinPalletSetings from "./CajasSinPalletSetings";

type propsType = {
    setPalletSeleccionado: (data: number) => void;
    guardarPalletSettings: (settings: settingsType) => Promise<void>;
    agregarItemCajasSinPallet: (data:itemType) => void
};

export default function Pallets(props: propsType): React.JSX.Element {
    const contenedores = useContext(contenedoresContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalSinPallet, setOpenModalSinPallet] = useState<boolean>(false);

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
                calibres:[],
                calidad:[],
                tipoCaja:[],
            },
        });
    useEffect(() => {
        const item = contenedores.find(cont => cont.numeroContenedor === numeroContenedor);
        if (item) {
            setContenedorSeleccionado(() => item);
        }
    }, [numeroContenedor, contenedores]);
    const openPalletSettings = () => {
        setOpenModal(true);
    };
    const closeModal = (): void => {
        setOpenModal(false);
    };
    return (
        <ScrollView>
            <View style={numeroContenedor === -1 ? styles.container2 : styles.container}>
                {contenedorSeleccionado.pallets.map((pallet, index) => (
                    <PalletComponent
                        pallet={index}
                        key={String(index) + pallet}
                        setPalletSeleccionado={props.setPalletSeleccionado}
                        openPalletSettings={openPalletSettings}
                    />
                ))}
                <CajasSinPalletComponent
                    setPalletSeleccionado={props.setPalletSeleccionado}
                    setOpenModalSinPallet={setOpenModalSinPallet}
                />
                <SettingsPallets
                    guardarPalletSettings={props.guardarPalletSettings}
                    closeModal={closeModal}
                    openModal={openModal} />

                <CajasSinPalletSetings
                    agregarItemCajasSinPallet={props.agregarItemCajasSinPallet}
                    openModalSinPallet={openModalSinPallet}
                    setOpenModalSinPallet={setOpenModalSinPallet} />
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: 900,
        flexWrap: 'wrap',
        margin: 30,
        minHeight: 155,
    },
    container2: { minHeight: 525, width: 925 },
});
