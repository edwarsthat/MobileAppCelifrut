/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, Alert } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import AsyncStorage from "@react-native-async-storage/async-storage";

type propsType = {
    pallet: number;
    handleClickPallet: (data: number) => void;
    openPalletSettings: () => void;
    render: boolean
};

export default function PalletComponent(props: propsType): React.JSX.Element {
    const palletSeleccionado = useContext(palletSeleccionadoContext);
    const idContenedor = useContext(contenedorSeleccionadoContext);
    const contenedores = useContext(contenedoresContext).find(
        cont => cont._id === idContenedor,
    );
    const [cajasContadas, setCajasContadas] = useState<string>('');

    useEffect(() => {
        getCajasContadas();
    }, [props.render]);

    const longPressHandle = () => {
        props.handleClickPallet(Number(props.pallet));
        props.openPalletSettings();
    };
    const palletFree = () => {
        if (contenedores && contenedores.pallets && contenedores?.pallets[props.pallet]) {
            const alltrue = Object.values(
                contenedores?.pallets[props.pallet].listaLiberarPallet
            ).every(val => val === true);
            return alltrue;
        }
        return false;
    };
    const getCajasContadas = async () => {
        try {
            const value = await AsyncStorage.getItem(`${contenedores?._id}:${props.pallet}`);
            if (value) {
                setCajasContadas(value);
            } else {
                setCajasContadas('');
            }
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error obteniendo las cajas contadas");
            }
        }
    };

    return (
        <View style={styles.palletContainer}>
            <TouchableOpacity
                style={
                    Number(props.pallet) === palletSeleccionado
                        ? styles.palletsPress
                        : (palletFree() ? styles.palletsButonsLiberado : styles.palletsButons)
                }
                onPress={() => props.handleClickPallet(Number(props.pallet))}
                onLongPress={longPressHandle}>
                <View
                    style={styles.viwImagen}>
                    <Image
                        source={require('../../../../../assets/palletIMG.webp')}
                        style={styles.image}
                    />
                    <Text style={styles.textPallet}>
                        {contenedores?.pallets && contenedores?.pallets[props.pallet] &&
                            contenedores?.pallets[props.pallet].settings.calibre}
                    </Text>
                </View>
                <View style={styles.viewTextPalletCajas}>
                    {cajasContadas === '' ?
                        <Text style={styles.textPalletCajas}>
                            {contenedores?.pallets && contenedores?.pallets[props.pallet] && contenedores.pallets[props.pallet].EF1 &&
                                contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0)}
                        </Text>
                        :
                        <Text style={styles.textPalletCajas}>
                            {contenedores?.pallets && contenedores?.pallets[props.pallet] && contenedores.pallets[props.pallet].EF1 &&
                                contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0)}
                            |
                            {contenedores?.pallets && contenedores?.pallets[props.pallet] && contenedores.pallets[props.pallet].EF1 &&
                                contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0) - Number(cajasContadas)}
                        </Text>}
                </View>
            </TouchableOpacity>
            <Text style={styles.fonts}>
                Pallet {props.pallet === -1 ? 'sin pallet' : props.pallet + 1}
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({
    palletContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    palletsButons: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
        overflow: 'hidden',
    },
    palletsButonsLiberado: {
        width: 100,
        height: 100,
        backgroundColor: '#FF22',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
    },
    image: {
        width: 40,
        height: 40,
    },
    palletsPress: {
        width: 100,
        height: 100,
        backgroundColor: '#D53B29',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
    },
    fonts: {
        color: 'white',
        fontSize: 12,
    },
    viwImagen: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
    },
    textPallet: {
        fontSize: 12,
    },
    viewTextPalletCajas: { marginLeft: 25 },
    textPalletCajas: { fontSize: 24, fontWeight: 'bold' },
});
