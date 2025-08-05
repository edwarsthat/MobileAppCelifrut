import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { PalletAsyncData } from "../types/types";
import { getPalletButtonStyle } from "../utils/pallets";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { calidadData } from "../../../../utils/functions";
import useTipoFrutaStore from "../../../../stores/useTipoFrutaStore";


type propsType = {
    handleClickPallet: (data: number) => void;
    openPalletSettings: () => void;
    palletsAsyncData: PalletAsyncData;
    numeroPallet: number;
};

export default React.memo(PalletComponent);

function PalletComponent({
    numeroPallet,
    handleClickPallet,
    openPalletSettings,
    palletsAsyncData,
}: propsType): React.JSX.Element {

    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const pallet = useListaDeEmpaqueStore(state => state.pallet);
    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta);

    const palletData = useMemo(
        () => contenedor?.pallets?.[numeroPallet] ?? null,
        [contenedor, pallet]
    );

    const totalCajas = useMemo(
        () => palletData?.EF1?.reduce((acu, item) => acu + item.cajas, 0) ?? 0,
        [palletData]
    );

    const palletFree = useMemo(() => {
        if (!palletData?.listaLiberarPallet) { return false; }
        return Object.values(palletData.listaLiberarPallet).every(val => val === true);
    }, [palletData]);

    const longPressHandle = () => {
        handleClickPallet(Number(pallet));
        openPalletSettings();
    };

    if (!palletData) {
        return (
            <View style={styles.palletContainer}>
                <Text>Pallet no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.palletContainer}>
            <TouchableOpacity
                style={[
                    styles.palletButtonBase,
                    getPalletButtonStyle(
                        Number(pallet) === numeroPallet,
                        palletFree,
                        palletsAsyncData?.selectedColor,
                        styles
                    ),
                ]}
                onPress={() => handleClickPallet(Number(numeroPallet))}
                onLongPress={longPressHandle}
            >
                <View style={styles.headerRow}>
                    <Image
                        source={require('../../../../../assets/palletIMG.webp')}
                        style={styles.image}
                    />
                    <Text style={styles.textCalibre}>
                        {palletData?.settings?.calibre ?? ''}
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    {/* Cajas totales */}
                    <Text style={styles.textPalletCajas}>
                        {totalCajas}
                        {palletsAsyncData?.cajasContadas !== '' && (
                            <>
                                {" | "}
                                {totalCajas - Number(palletsAsyncData?.cajasContadas || 0)}
                            </>
                        )}
                    </Text>

                    {/* tipoCaja y calidad */}
                    <Text style={styles.textDetalle}>
                        Tipo Caja: {palletData?.settings?.tipoCaja ?? 'N/A'}
                    </Text>
                    <Text style={styles.textDetalle}>
                        Calidad: {calidadData(tipoFrutas, palletData?.settings?.calidad)?.nombre ?? 'N/A'}
                    </Text>
                </View>

            </TouchableOpacity>
            <Text style={styles.fonts}>
                Pallet {numeroPallet + 1}
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
