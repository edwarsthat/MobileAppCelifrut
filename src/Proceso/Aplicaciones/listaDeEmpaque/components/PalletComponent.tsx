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
    const [selectedColor, setSelectedColor] = useState<string>("white");


    useEffect(() => {
        getCajasContadas();
    }, [contenedores, props.render]);


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
            const color = await AsyncStorage.getItem(`${contenedores?._id}:${props.pallet}:color`);



            if (value !== null) {
                setCajasContadas(value);
            } else {
                setCajasContadas('');
            }

            if (color !== null) {
                setSelectedColor(color);
            } else {
                setSelectedColor('#FFFFFF');
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
                style={[
                    styles.palletButtonBase,
                    Number(props.pallet) === palletSeleccionado
                        ? styles.palletSelected  // Rojo si está seleccionado
                        : (palletFree()
                            ? styles.palletLiberado  // Verde si está liberado
                            : { backgroundColor: selectedColor || 'white' } // Usa el color guardado o blanco por defecto
                        ),
                ]}
                onPress={() => props.handleClickPallet(Number(props.pallet))}
                onLongPress={longPressHandle}
            >
                <View style={styles.headerRow}>
                    <Image
                        source={require('../../../../../assets/palletIMG.webp')}
                        style={styles.image}
                    />
                    <Text style={styles.textCalibre}>
                        {contenedores?.pallets?.[props.pallet]?.settings?.calibre ?? ''}
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    {/* Cajas totales */}
                    <Text style={styles.textPalletCajas}>
                        {contenedores?.pallets?.[props.pallet]?.EF1
                            ? contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0)
                            : 0
                        }
                        {cajasContadas !== '' && (
                            <>
                                {" | "}
                                {contenedores?.pallets?.[props.pallet]?.EF1
                                    ? contenedores.pallets[props.pallet].EF1.reduce((acu, item) => acu + item.cajas, 0) - Number(cajasContadas)
                                    : 0
                                }
                            </>
                        )}
                    </Text>

                    {/* tipoCaja y calidad */}
                    <Text style={styles.textDetalle}>
                        Tipo Caja: {contenedores?.pallets?.[props.pallet]?.settings?.tipoCaja ?? 'N/A'}
                    </Text>
                    <Text style={styles.textDetalle}>
                        Calidad: {contenedores?.pallets?.[props.pallet]?.settings?.calidad ?? 'N/A'}
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
        margin: 8,
    },
    palletButtonBase: {
        width: 110,
        height: 120,
        margin: 5,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#52006A',
        padding: 8,
        justifyContent: 'center',
    },
    palletNormal: {
        backgroundColor: 'white',
    },
    palletLiberado: {
        backgroundColor: '#158433', // Un color suave que indique liberado
    },
    palletSelected: {
        backgroundColor: '#D53B29', // Color rojo para indicar seleccionado
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode: 'contain',
    },
    textCalibre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textPalletCajas: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    textDetalle: {
        fontSize: 12,
        color: '#555',
    },
    fonts: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
});
