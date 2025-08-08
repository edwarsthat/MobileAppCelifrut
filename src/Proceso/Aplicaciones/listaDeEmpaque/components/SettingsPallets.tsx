import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Modal, StyleSheet, Text, TouchableOpacity, Button, Alert, TextInput } from "react-native";
import { settingsType } from "../types/types";
import { deviceWidth } from "../../../../../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButtonGroup from "./RadioButtonGroup";
import { INITIAL_CONFIG_PALLET } from "../constants/configs";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import useTipoFrutaStore from "../../../../stores/useTipoFrutaStore";
import { getCalidadesFrutas } from "../../../../utils/functions";

type propsType = {
    openModal: boolean;
    closeModal: () => void;
    guardarPalletSettings: (settings: settingsType,) => Promise<void>;
    liberarPallet: (item: any) => void
    isTablet: boolean

}


const colors = [
    '#FAD2E1',  // Rosa claro pastel
    '#F5E1FD',  // Lila pastel
    '#FFF1D0',  // Amarillo pastel suave
    '#FFD7B5',  // Naranja pastel claro
    '#FFFFFF',
    '#E2C2FF',  // Lavanda claro
    '#FAE3D9',  // Melocotón pastel
    '#D7E5CA',  // Verde menta apagado
    '#FEE4C3',  // Crema pastel
];

export default function SettingsPallets(props: propsType): React.JSX.Element {
    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta);
    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const pallet = useListaDeEmpaqueStore(state => state.pallet);
    const anchoDevice = useContext(deviceWidth);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [cajasContadas, setCajasContadas] = useState<string>('');

    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
        getCajasContadas();
        if (pallet !== -1 && contenedor) {
            const infoLiberacion = contenedor.pallets[pallet].listaLiberarPallet;
            setConfig(prevConfig => ({
                ...prevConfig,
                rotulado: infoLiberacion.rotulado,
                paletizado: infoLiberacion.paletizado,
                enzunchado: infoLiberacion.enzunchado,
                estadoCajas: infoLiberacion.estadoCajas,
                estiba: infoLiberacion.estiba,
            }));
        } else {
            setConfig(prevConfig => ({
                ...prevConfig,
                rotulado: false,
                paletizado: false,
                enzunchado: false,
                estadoCajas: false,
                estiba: false,
            }));
        }
    }, [props.openModal, contenedor, pallet, anchoDevice]);

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [config, setConfig] = useState(INITIAL_CONFIG_PALLET);

    const clickGuardar = (): void => {
        if (config.tipoCaja === '' || config.calidad === '' || config.calibre === '') {
            return Alert.alert("No ha seleccionado todos los campos necesarios");
        }
        props.guardarPalletSettings({
            tipoCaja: config.tipoCaja,
            calidad: config.calidad,
            calibre: config.calibre,
        });
        props.closeModal();
        setConfig(INITIAL_CONFIG_PALLET);
    };
    const clickClose = (): void => {
        props.closeModal();
        setConfig(INITIAL_CONFIG_PALLET);
    };
    const liberarPallets = (): void => {
        const item = {
            rotulado: config.rotulado,
            paletizado: config.paletizado,
            enzunchado: config.enzunchado,
            estadoCajas: config.estadoCajas,
            estiba: config.estiba,
        };
        props.liberarPallet(item);
        props.closeModal();
    };
    const handleCajasContadas = async (e: string) => {
        try {
            console.log(`${contenedor?._id}:${pallet}`, e);

            await AsyncStorage.setItem(`${contenedor?._id}:${pallet}`, e);
            setCajasContadas(e);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error configurando las cajas contadas");
            }
        }
    };
    const handleColorPallet = async (color: string) => {
        try {
            console.log(`${contenedor?._id}:${pallet}:color`, color);
            await AsyncStorage.setItem(`${contenedor?._id}:${pallet}:color`, color);
            setSelectedColor(color);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error configurando el color del pallet");
            }
        }

    };
    const getCajasContadas = async () => {
        try {
            const value = await AsyncStorage.getItem(`${contenedor?._id}:${pallet}`);
            if (value) {
                setCajasContadas(value);

            } else {
                setCajasContadas('');
            }
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error configurando las cajas contadas");
            }
        }
    };
    return (
        <Modal transparent={true}
            visible={props.openModal}
            animationType="fade">
            <View style={isTablet ? styles.centerModal : stylesCel.centerModal}>
                <View style={isTablet ? styles.viewModal : stylesCel.viewModal}>
                    {props.isTablet &&
                        <ScrollView style={[styles.modal, styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                            <Text style={styles.tituloModal}>Configurar Pallet {pallet + 1}</Text>
                            <RadioButtonGroup
                                options={contenedor?.infoContenedor.tipoCaja.map(item => ({ _id: item, name: item })) || [{ _id: '', name: '' }]}
                                value={config.tipoCaja}
                                onSelect={(value) => setConfig((prev) => ({ ...prev, tipoCaja: value }))}
                                label="Tipo de Caja"
                                styles={styles} />

                            <RadioButtonGroup
                                options={getCalidadesFrutas(contenedor, tipoFrutas).map(item => ({ _id: item?._id, name: item?.nombre })) || [{ _id: '', name: '' }]}
                                value={config.calidad}
                                onSelect={(value) => setConfig((prev) => ({ ...prev, calidad: value }))}
                                label="Calidad"
                                styles={styles} />

                            <RadioButtonGroup
                                options={contenedor?.infoContenedor.calibres.map(item => ({ _id: item, name: item })) || [{ _id: '', name: '' }]}
                                value={config.calibre}
                                onSelect={(value) => setConfig((prev) => ({ ...prev, calibre: value }))}
                                label="Calibre"
                                styles={styles} />

                            <View style={styles.containerButtonsModal}>
                                <Button title="Guardar" onPress={clickGuardar} />
                                <Button title="Cancelar" onPress={clickClose} />
                            </View>
                        </ScrollView>
                    }
                    <ScrollView style={[styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                        <Text style={styles.tituloModal}>Liberacion pallets</Text>
                        <View style={isTablet ? styles.contenedorLiberacionPallet : stylesCel.contenedorLiberacionPallet}>
                            <TouchableOpacity onPress={() => setConfig(prevConfig => ({ ...prevConfig, rotulado: !prevConfig.rotulado }))}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {config.rotulado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Rotulado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setConfig(prevConfig => ({ ...prevConfig, paletizado: !prevConfig.paletizado }))}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {config.paletizado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Paletizado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setConfig(prevConfig => ({ ...prevConfig, enzunchado: !prevConfig.enzunchado }))}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {config.enzunchado ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Enzunchado</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setConfig(prevConfig => ({ ...prevConfig, estadoCajas: !prevConfig.estadoCajas }))}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {config.estadoCajas ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Estado cajas</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setConfig(prevConfig => ({ ...prevConfig, estiba: !prevConfig.estiba }))}>
                                <View style={styles.radioButton}>
                                    <View style={styles.radio}>
                                        {config.estiba ? <View style={styles.radioBg}>{ }</View> : null}
                                    </View>
                                    <Text>Estiba tipo exportación</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewButtonsLiberacionPallet}>
                            <Button title="Guardar" onPress={liberarPallets} />
                            <Button title="Cancelar" onPress={props.closeModal} />
                        </View>
                    </ScrollView>
                    {props.isTablet &&
                        <ScrollView style={[styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                            <Text style={styles.tituloModal}>Cajas ya contadas</Text>
                            <TextInput
                                onChangeText={handleCajasContadas}
                                keyboardType="numeric"
                                value={cajasContadas}
                                style={styles.modalInput}
                            />
                            <View style={styles.viewColorSelectContainer}>
                                <Text>Selecciona un color:</Text>
                                <View style={styles.viewColorSelectCirculos}>
                                    {colors.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            onPress={() => handleColorPallet(color)}
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: color },
                                                selectedColor === color ? styles.selectedCircle : null,
                                            ]}
                                        />
                                    ))}
                                </View>
                                {selectedColor && (
                                    <Text style={styles.selectedText}>Color seleccionado: {selectedColor}</Text>
                                )}
                            </View>
                        </ScrollView>
                    }
                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)', // overlay semitransparente
    },
    modalInput: {
        width: 160,
        height: 44,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#CBD5E1',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        color: '#0F172A',
    },
    viewModal: {
        display: 'flex',
        backgroundColor: '#FFFFFF',
        width: '92%',
        maxWidth: 1200,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'stretch',
        padding: 16,
        gap: 32,
        alignSelf: 'center',
        // sombra coherente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 12,
    },
    modal: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        width: 340,
        padding: 0,
    },
    modalCajas: {
        display: 'flex',
        flexDirection: 'column',
        width: 260,
        padding: 0,
        // removed vertical divider to usar card con borde
    },
    sectionCard: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    sectionCardInner: {
        padding: 16,
    },
    sectionStretch: {
        alignSelf: 'stretch',
    },
    tituloModal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
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
        gap: 8,
    },
    radio: {
        width: 24,
        height: 24,
        borderColor: '#8B9E39',
        borderWidth: 2,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioBg: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#8B9E39',
    },
    viewCalidad: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    containerButtonsModal: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 16,
    },
    contenedorLiberacionPallet: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
    },
    viewButtonsLiberacionPallet: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        paddingVertical: 24,
    },
    viewColorSelectContainer: {
        gap: 16,
        width: 260,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 16,
        borderRightColor: 'transparent',
        borderRightWidth: 0,

    },
    viewColorSelectCirculos: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 10,

    },

    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedCircle: {
        borderWidth: 3,
        borderColor: '#8B9E39',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    selectedText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
});

const stylesCel = StyleSheet.create({
    centerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    viewModal: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '94%',
        alignSelf: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        borderRadius: 16,
        padding: 16,
        gap: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 12,
    },

    contenedorLiberacionPallet: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column',
        gap: 14,
        padding: 16,
    },
    viewButtonsLiberacionPallet: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        gap: 16,
        paddingVertical: 24,
    },
});
