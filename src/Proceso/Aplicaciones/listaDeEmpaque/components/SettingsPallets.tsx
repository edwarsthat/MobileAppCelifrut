import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Modal, StyleSheet, Text, TouchableOpacity, Button, Alert, TextInput } from "react-native";
import { settingsType } from "../types/types";
import { deviceWidth } from "../../../../../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButtonGroup from "./RadioButtonGroup";
import { INITIAL_CONFIG_PALLET } from "../constants/configs";
import { useListaDeEmpaqueStore } from "../store/useListaDeEmpaqueStore";
import { cuartosFriosType } from "../../../../../types/catalogs";
import { palletsType } from "../../../../../types/contenedores/palletsType";

type propsType = {
    pallets: palletsType[]
    openModal: boolean;
    closeModal: () => void;
    guardarPalletSettings: (settings: settingsType, itemCalidad: any) => Promise<void>;
    isTablet: boolean
    enviarCajasCuartoFrio: (cuarto: cuartosFriosType, items: string[]) => Promise<void>;
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

export default function SettingsPallets({
    openModal, guardarPalletSettings, isTablet, closeModal, enviarCajasCuartoFrio, pallets,
}: propsType): React.JSX.Element {

    const contenedor = useListaDeEmpaqueStore(state => state.contenedor);
    const palletSeleccionado = useListaDeEmpaqueStore(state => state.pallet);
    const cuartosFrios = useListaDeEmpaqueStore(state => state.cuartosFrios);
    const anchoDevice = useContext(deviceWidth);
    const [isTabletState, setIsTablet] = useState<boolean>(false);
    const [cajasContadas, setCajasContadas] = useState<string>('');

    useEffect(() => {
        setIsTablet(anchoDevice >= 721);
        getCajasContadas();
        if (palletSeleccionado !== -1 && contenedor) {
            const infoPallet = pallets.find(p => p.numeroPallet === (palletSeleccionado));
            if(!infoPallet) {
                return;
            }
            setConfig(prevConfig => ({
                ...prevConfig,
                rotulado: infoPallet?.rotulado,
                paletizado: infoPallet?.paletizado,
                enzunchado: infoPallet?.enzunchado,
                estadoCajas: infoPallet?.estadoCajas,
                estiba: infoPallet?.estiba,
                calibre: infoPallet?.calibre || '',
                calidad: infoPallet?.calidad._id || '',
                tipoCaja: infoPallet?.tipoCaja || '',
            }));
        } else {
            setConfig(prevConfig => ({
                ...prevConfig,
                rotulado: false,
                paletizado: false,
                enzunchado: false,
                estadoCajas: false,
                estiba: false,
                calibre: '',
                calidad: '',
                tipoCaja: '',
            }));
        }
    }, [openModal, contenedor, palletSeleccionado, anchoDevice]);

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [config, setConfig] = useState(INITIAL_CONFIG_PALLET);


    const handleCajasContadas = async (e: string) => {
        try {
            console.log(`${contenedor?._id}:${palletSeleccionado}`, e);
            await AsyncStorage.setItem(`${contenedor?._id}:${palletSeleccionado}`, e);
            setCajasContadas(e);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error configurando las cajas contadas");
            }
        }
    };
    const handleColorPallet = async (color: string) => {
        try {
            console.log(`${contenedor?._id}:${palletSeleccionado}:color`, color);
            await AsyncStorage.setItem(`${contenedor?._id}:${palletSeleccionado}:color`, color);
            setSelectedColor(color);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error configurando el color del pallet");
            }
        }
    };
    const getCajasContadas = async () => {
        try {
            const value = await AsyncStorage.getItem(`${contenedor?._id}:${palletSeleccionado}`);
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
    const guardarPalletSettingsHandle = async () => {
        try {
            const itemsCalidad = {
                rotulado: config.rotulado,
                paletizado: config.paletizado,
                enzunchado: config.enzunchado,
                estadoCajas: config.estadoCajas,
                estiba: config.estiba,
            };
            const configuracion = {
                tipoCaja: config.tipoCaja,
                calidad: config.calidad,
                calibre: config.calibre,
            };
            if (!config.tipoCaja || !config.calidad || !config.calibre) {
                Alert.alert("Error", "Por favor completa todos los campos obligatorios: Tipo de Caja, Calidad y Calibre.");
                return;
            }
            await guardarPalletSettings(configuracion, itemsCalidad);
            closeModal();
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error guardando la configuración del pallet");
            }
        }
    };
    const handleEnviarPalletCuartoFrio = async () => {
        try {
            const idsItems = [];

            for (const item of pallets || []) {
                idsItems.push(item._id);
            }
            const cuartoFrioSeleccionado = cuartosFrios.find(cf => cf._id === config.cuartoFrio);
            if (!cuartoFrioSeleccionado) {
                throw new Error("No se ha seleccionado un cuarto frío válido.");
            }
            await enviarCajasCuartoFrio(cuartoFrioSeleccionado, idsItems);
            closeModal();
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error enviando el pallet al cuarto frío");
            }
        }
    };
    return (
        <Modal transparent={true}
            visible={openModal}
            animationType="fade">
            <View style={isTablet ? styles.centerModal : stylesCel.centerModal}>
                <View style={isTablet ? styles.viewModal : stylesCel.viewModal}>
                    <View style={isTablet ? styles.modalContent : undefined}>
                        {isTablet ? (
                            <>
                                <View style={styles.column}>
                                    <ScrollView style={[styles.modal, styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                                        <Text style={styles.tituloModal}>Configurar Pallet {palletSeleccionado + 1}</Text>
                                        <RadioButtonGroup
                                            options={contenedor?.infoContenedor.tipoCaja.map(item => ({ _id: item, name: item })) || [{ _id: '', name: '' }]}
                                            value={config.tipoCaja}
                                            onSelect={(value) => setConfig((prev) => ({ ...prev, tipoCaja: value }))}
                                            label="Tipo de Caja"
                                            styles={styles} />

                                        <RadioButtonGroup
                                            options={contenedor?.infoContenedor?.calidad?.map(item => ({ _id: item._id, name: item.nombre })) || [{ _id: '', name: '' }]}
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
                                    </ScrollView>
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
                                </View>
                                <View style={styles.column}>
                                    <ScrollView style={[styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                                        <Text style={styles.tituloModal}>Liberacion pallets</Text>
                                        <View style={isTabletState ? styles.contenedorLiberacionPallet : stylesCel.contenedorLiberacionPallet}>
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
                                    </ScrollView>
                                    <ScrollView style={[styles.sectionCard, styles.sectionStretch]} contentContainerStyle={styles.sectionCardInner}>
                                        <Text style={styles.tituloModal}>Enviar a Cuarto Frío</Text>
                                        <RadioButtonGroup
                                            options={cuartosFrios.map(item => ({ _id: item._id, name: item.nombre })) || [{ _id: '', name: '' }]}
                                            value={config.cuartoFrio}
                                            onSelect={(value) => setConfig((prev) => ({ ...prev, cuartoFrio: value }))}
                                            label="Cuarto Frío"
                                            styles={styles} />

                                        <View style={styles.containerButtonsModal}>
                                            <Button title="Enviar a Cuarto Frío" onPress={handleEnviarPalletCuartoFrio} />
                                        </View>
                                    </ScrollView>
                                </View>
                            </>
                        ) : (
                            <>
                                <ScrollView style={stylesCel.scrollViewMobile} contentContainerStyle={stylesCel.scrollContentMobile}>
                                    <Text style={styles.tituloModal}>Liberacion pallets</Text>
                                    <View style={stylesCel.contenedorLiberacionPallet}>
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
                                </ScrollView>
                            </>
                        )}
                    </View>
                    <View style={isTablet ? styles.containerButtonsModal : stylesCel.containerButtonsMobile}>
                        <Button title="Guardar2" onPress={guardarPalletSettingsHandle} />
                        <Button title="Cancelar" onPress={closeModal} />
                    </View>
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
        flexDirection: 'column',
        borderRadius: 20,
        padding: 16,
        gap: 16,
        alignSelf: 'center',
        // sombra coherente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 12,
    },
    modalContent: {
        flexDirection: 'row',
        gap: 16,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        gap: 16,
    },
    modal: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        width: '100%',
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
    infoText: {
        marginBottom: 12,
        color: '#475569',
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
        width: '94%',
        maxHeight: '80%',
        alignSelf: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 12,
        overflow: 'hidden',
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
    scrollViewMobile: {
        flexShrink: 1,
    },
    scrollContentMobile: {
        padding: 16,
        paddingBottom: 0,
    },
    containerButtonsMobile: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        paddingTop: 12,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
});
