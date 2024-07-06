/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext, palletSeleccionadoContext } from "../ListaDeEmpaque";

type propsType = {
    pallet: number;
    setPalletSeleccionado: (data: number) => void;
    openPalletSettings: () => void;
};

export default function PalletComponent(props: propsType): React.JSX.Element {
    const palletSeleccionado = useContext(palletSeleccionadoContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const contenedores = useContext(contenedoresContext).find(
        cont => cont.numeroContenedor === numeroContenedor,
    );

    const longPressHandle = () => {
        props.setPalletSeleccionado(Number(props.pallet));
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

    return (
        <View style={styles.palletContainer}>
            <TouchableOpacity
                style={
                    Number(props.pallet) === palletSeleccionado
                        ? styles.palletsPress
                        : (palletFree() ? styles.palletsButonsLiberado : styles.palletsButons)
                }
                onPress={() => props.setPalletSeleccionado(Number(props.pallet))}
                onLongPress={longPressHandle}>
                <View
                    style={styles.viwImagen}>
                    <Image
                        source={require('../../../../../assets/palletIMG.png')}
                        style={styles.image}
                    />
                    <Text style={styles.textPallet}>
                        {contenedores?.pallets && contenedores?.pallets[props.pallet] &&
                            contenedores?.pallets[props.pallet].settings.calibre}
                    </Text>
                </View>
                <View style={styles.viewTextPalletCajas}>
                    <Text style={styles.textPalletCajas}>
                        { contenedores?.pallets && contenedores?.pallets[props.pallet] && contenedores.pallets[props.pallet].EF1 &&
                            contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0)}
                    </Text>
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
        width: 115,
        height: 115,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
    },
    palletsButonsLiberado: {
        width: 115,
        height: 115,
        backgroundColor: '#FF22',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
    },
    image: {
        width: 50,
        height: 50,
    },
    palletsPress: {
        width: 115,
        height: 115,
        backgroundColor: '#D53B29',
        margin: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
    },
    fonts: {
        color: 'white',
        fontSize: 15,
    },
    viwImagen: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
    },
    textPallet:{ fontSize: 20 },
    viewTextPalletCajas:{ marginLeft: 25 },
    textPalletCajas:{ fontSize: 50, fontWeight: 'bold' },
});
