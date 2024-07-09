/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { View, Modal, StyleSheet, Text, TouchableOpacity, Button, Alert } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { settingsType } from "../types/types";

type propsType = {
    openModal: boolean;
    closeModal: () => void;
    guardarPalletSettings: (settings: settingsType,) => Promise<void>;
    liberarPallet: (item:any) => void

}
export default function SettingsPallets(props: propsType): React.JSX.Element {
    const pallet = useContext(palletSeleccionadoContext);
    const contenedorSeleccionado = useContext(contenedorSeleccionadoContext);
    const contenedor = useContext(contenedoresContext).find(cont => cont.numeroContenedor === contenedorSeleccionado);

    useEffect(() => {
        if (pallet !== -1 && contenedor) {
            const infoLiberacion = contenedor.pallets[pallet].listaLiberarPallet;
            setRotulado(infoLiberacion.rotulado);
            setPaletizado(infoLiberacion.paletizado);
            setEnzunchado(infoLiberacion.enzunchado);
            setEstadoCajas(infoLiberacion.estadoCajas);
            setEstiba(infoLiberacion.estiba);
        } else {
            setRotulado(false);
            setPaletizado(false);
            setEnzunchado(false);
            setEstadoCajas(false);
            setEstiba(false);
        }
    }, [props.openModal, contenedor, pallet]);

    const [radioButtonTipoCaja, setRadioButtonTipoCaja] = useState<string>('');
    const [radioButtonCalidad, setRadioButtonCalidad] = useState<string>('');
    const [radioButtonCalibre, setRadioButtonCalibre] = useState<string>('');

    const [rotulado, setRotulado] = useState<boolean>(false);
    const [paletizado, setPaletizado] = useState<boolean>(false);
    const [enzunchado, setEnzunchado] = useState<boolean>(false);
    const [estadoCajas, setEstadoCajas] = useState<boolean>(false);
    const [estiba, setEstiba] = useState<boolean>(false);
    const clickGuardar = (): void => {
        if (radioButtonCalibre === '' && radioButtonCalidad === '' && radioButtonTipoCaja === '') {
            props.closeModal();
            return Alert.alert("No ha seleccionado ninguna configuración");
        }
        props.guardarPalletSettings({
            tipoCaja: radioButtonTipoCaja,
            calidad: radioButtonCalidad,
            calibre: radioButtonCalibre,
        });
        props.closeModal();
        setRadioButtonCalibre('');
        setRadioButtonTipoCaja('');
        setRadioButtonCalidad('');
    };
    const liberarPallets = ():void => {
        const item = {
            rotulado:rotulado,
            paletizado:paletizado,
            enzunchado:enzunchado,
            estadoCajas:estadoCajas,
            estiba:estiba,
        };
        props.liberarPallet(item);
        props.closeModal();
    };
    return (
        <Modal transparent={true}
            visible={props.openModal}
            animationType="fade">
            <View style={styles.centerModal}>
                <View style={styles.viewModal}>
                    <View style={styles.modal}>
                        <Text style={styles.tituloModal}>Configurar Pallet {pallet + 1}</Text>
                        <View style={styles.containerConfigurarPallet}>
                            {contenedor?.infoContenedor.tipoCaja?.map((caja, index) => (
                                <TouchableOpacity onPress={() => setRadioButtonTipoCaja(caja)} key={caja + index}>
                                    <View style={styles.radioButton}>
                                        <View style={styles.radio}>
                                            {radioButtonTipoCaja === caja ? (
                                                <View style={styles.radioBg}>{ }</View>
                                            ) : null}
                                        </View>
                                        <Text>{caja} Kg</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.containerConfigurarPallet}>
                            <Text>Calidad</Text>
                            <View style={styles.viewCalidad}>
                                {contenedor?.infoContenedor.calidad.map((calidad, index) => (
                                    <TouchableOpacity onPress={() => setRadioButtonCalidad(calidad)} key={index}>
                                        <View style={styles.radioButton}>
                                            <View style={styles.radio}>
                                                {radioButtonCalidad === calidad ? (
                                                    <View style={styles.radioBg}>{ }</View>
                                                ) : null}
                                            </View>
                                            <Text>{calidad}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.containerConfigurarPallet}>
                                <Text>Calibre</Text>
                                <View style={styles.viewCalidad}>
                                    {contenedor?.infoContenedor.calibres.map((calibre, index) => (
                                        <TouchableOpacity onPress={() => setRadioButtonCalibre(calibre)} key={index}>
                                            <View style={styles.radioButton}>
                                                <View style={styles.radio}>
                                                    {radioButtonCalibre === calibre ? (
                                                        <View style={styles.radioBg}>{ }</View>
                                                    ) : null}
                                                </View>
                                                <Text>{calibre}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerButtonsModal}>
                            <Button title="Guardar" onPress={clickGuardar} />
                            <Button title="Cancelar" onPress={props.closeModal} />
                        </View>
                    </View>
                    <View>
                        <View style={styles.modal}>
                            <Text style={styles.tituloModal}>Liberacion pallets</Text>
                        </View>
                        <View style={styles.contenedorLiberacionPallet}>
                            <TouchableOpacity onPress={() => setRotulado(!rotulado)}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {rotulado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Rotulado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPaletizado(!paletizado)}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {paletizado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Paletizado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEnzunchado(!enzunchado)}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {enzunchado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Enzunchado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEstadoCajas(!estadoCajas)}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {estadoCajas ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Estado cajas</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEstiba(!estiba)}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {estiba ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Estiba tipo exportación</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewButtonsLiberacionPallet}>
                            <Button title="Guardar" onPress={liberarPallets}/>
                            <Button title="Cancelar" onPress={props.closeModal} />
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
});
