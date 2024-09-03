/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import {
    Modal, Button, View, StyleSheet, Text, TextInputChangeEventData, TextInput, NativeSyntheticEvent, Alert,
} from "react-native";
import { loteSeleccionadoContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { itemType } from "../types/types";
import { deviceWidth } from "../../../../../App";

type propsType = {
    openModalSinPallet: boolean;
    setOpenModalSinPallet: (data: boolean) => void;
    agregarItemCajasSinPallet: (data: itemType) => void;
};

export default function CajasSinPalletSetings(props: propsType): React.JSX.Element {
    const loteSeleccionado = useContext(loteSeleccionadoContext);
    const pallet = useContext(palletSeleccionadoContext);
    const anchoDevice = useContext(deviceWidth);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [tipoCaja, setTipocCaja] = useState<string>('');
    const [calidad, setCalidad] = useState<string>('');
    const [calibre, setCalibre] = useState<string>('');
    const [cajas, setCajas] = useState<string>('');

    useEffect(() => { setIsTablet(anchoDevice >= 721); }, [anchoDevice]);
    const getInput = (
        e: NativeSyntheticEvent<TextInputChangeEventData>,
    ): void => {
        setCajas(e.nativeEvent.text);
    };

    const clickGuardar = () => {
        if (loteSeleccionado.enf === '') { return Alert.alert('No ha seleccionado predio'); }
        if (cajas === '') { Alert.alert('Ingrese las cajas'); }
        if ((tipoCaja === '' ||
            calidad === '' ||
            calibre === '' ||
            loteSeleccionado.enf === '')) {
            Alert.alert('No ha seleccionado ninguna configuracion');
        }
        const item: itemType = {
            lote: loteSeleccionado._id,
            cajas: Number(cajas),
            tipoCaja: tipoCaja,
            calibre: calibre,
            calidad: calidad,
            fecha: new Date(),
            tipoFruta: loteSeleccionado.tipoFruta,
        };
        props.agregarItemCajasSinPallet(item);

        setCajas('');
        setTipocCaja('');
        setCalidad('');
        setCalibre('');
    };
    return (
        <Modal transparent={true}
            visible={props.openModalSinPallet}
            animationType="fade">
            <View style={styles.centerModal}>
                <View style={isTablet ? styles.viewModal : stylesCel.viewModal}>
                    <View style={styles.modal}>
                        <Text style={styles.tituloModal}>Configurar Pallet {pallet + 1}</Text>
                        <Text>Tipo de la caja</Text>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                style={styles.inputCajas}
                                onChangeText={setTipocCaja}
                                value={tipoCaja} />
                        </View>
                        <View style={styles.containerConfigurarPallet}>
                            <Text>Calidad</Text>
                            <View style={styles.viewTextInput}>
                            <TextInput
                                style={styles.inputCajas}
                                onChangeText={setCalidad}
                                value={calidad} />
                        </View>
                            <View style={styles.containerConfigurarPallet}>
                                <Text>Calibre</Text>
                                <View style={styles.viewTextInput}>
                                    <TextInput
                                        style={styles.inputCajas}
                                        onChangeText={setTipocCaja}
                                        value={calibre} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.modalCajas}>
                        <View style={styles.modal}>
                            <Text style={styles.tituloModal}>
                                Ingresar El numero de cajas{' '}
                            </Text>
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                style={styles.inputCajas}
                                onChange={e => getInput(e)}
                                keyboardType="numeric"
                                value={cajas} />
                        </View>
                        <View
                            style={styles.viewButtons}>
                            <Button title="Guardar" onPress={clickGuardar} />
                            <Button
                                title="Cancelar"
                                onPress={() => props.setOpenModalSinPallet(false)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    centerModal: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: '10%',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 850,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'flex-start',
        paddingBottom: 20,
        paddingTop: 10,
        marginLeft: '10%',
        gap: 50,
        shadowColor: '#52006A',
        elevation: 20,
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        width: 400,
        padding: 20,
        borderRightColor: '#999999',
        borderRightWidth: 1,
    },
    tituloModal: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    containerConfigurarPallet: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 10,
    },
    radioButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    radio: {
        width: 30,
        height: 30,
        borderColor: '#0074D9',
        borderRadius: 15,
        borderWidth: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioBg: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#0074D9',
    },
    viewCalidad: { display: 'flex', flexDirection: 'row', gap: 20 },
    containerButtonsModal: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 15,
    },
    contenedorLiberacionPallet: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    viewButtonsLiberacionPallet: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        paddingTop: 35,
    },
    modalCajas: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
    },
    viewTextInput: { marginLeft: 15, marginTop: 20 },
    inputCajas: {
        borderWidth: 1,
        borderRadius: 15,
        width: '80%',
    },
    viewButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        marginTop: 40,
        justifyContent: 'center',
        marginRight: 45,
    },
    textInput: {
        width: 150,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
    },
});

const stylesCel = StyleSheet.create({
    viewModal: {
        display: 'flex',
        backgroundColor: 'white',
        width: 'auto',
        flexDirection: 'column',
        borderRadius: 20,
        paddingBottom: 20,
        paddingTop: 10,
        gap: 50,
        shadowColor: '#52006A',
        elevation: 20,
    },
});
