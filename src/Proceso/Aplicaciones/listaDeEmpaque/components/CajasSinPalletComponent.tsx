/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { cajasSinPalletContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

type propsType = {
    setPalletSeleccionado: (data: number) => void;
    setOpenModalSinPallet: (data: boolean) => void;
};

export default function CajasSinPalletComponent(props: propsType): React.JSX.Element {
    const cajasSinPallet = useContext(cajasSinPalletContext);
    const palletSeleccionado = useContext(palletSeleccionadoContext);
    return (
        <View style={styles.palletContainer}>
            <TouchableOpacity
                style={palletSeleccionado === -1 ? styles.palletsPress : styles.palletsButons}
                onPress={() => props.setPalletSeleccionado(-1)}
                onLongPress={() => props.setOpenModalSinPallet(true)}>
                <View style={styles.view1}/>
                <View style={styles.view2}>
                    <Text style={styles.text1}>
                        {Array.isArray(cajasSinPallet) && cajasSinPallet.reduce((acu, item) => (acu += item.cajas), 0)}
                    </Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.fonts}>Cajas sin pallet</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    palletContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    palletsButons: {
      width: 90,
      height: 90,
      backgroundColor: 'white',
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
      width: 90,
      height: 90,
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
    view1:{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
    },
    view2:{ marginLeft: 25 },
    text1:{ fontSize: 30, fontWeight: 'bold' },
  });

