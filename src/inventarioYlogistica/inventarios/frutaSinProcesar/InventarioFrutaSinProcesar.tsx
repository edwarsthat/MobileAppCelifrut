/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import HorizontalLine from "../../../components/HorizontalLine";
import { getCredentials } from "../../../../utils/auth";
import { lotesType } from "../../../../types/lotesType";
import TablaFruta from "./components/TablaFruta";
import FrutaSinProcesarDirectoNacional from "./components/FrutaSinProcesarDirectoNacional";
import FrutaSinProcesarDesverdizado from "./components/FrutaSinProcesarDesverdizado";
const URL = "http://192.168.0.172:3010";

export default function InventarioFrutaSinProcesar(): React.JSX.Element {
    const [filtro, setFiltro] = useState<string>('');
    const [data, setData] = useState<lotesType[]>();
    const [dataOriginal, setDataOriginal] = useState<lotesType[]>();
    const [showTable, setShowTable] = useState<string>("table");
    const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>();
    useEffect(() => { obtenerFruta(); }, []);
    useEffect(() => {
        if (dataOriginal !== undefined && filtro !== '') {
            const datos = dataOriginal.filter(lote =>
            (lote.predio.PREDIO.toLowerCase().startsWith(filtro.toLowerCase()) ||
                lote.tipoFruta.toLowerCase().startsWith(filtro.toLowerCase()) ||
                lote.enf.toLowerCase().startsWith(filtro.toLowerCase())));

            setData(datos);

        } else if (filtro === '') {
            setData(dataOriginal);
        }
    }, [filtro, dataOriginal]);

    const obtenerFruta = async () => {
        try {
            const token = await getCredentials();
            const requesOperariosJSON = await fetch(`${URL}/proceso/getInventario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${token}`,
                },
            });
            const response = await requesOperariosJSON.json();
            if (response.status !== 200) {
                throw new Error(`Cose ${response.status}: ${response.message}`);
            }
            setData(response.data);
            setDataOriginal(response.data);
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.message);
            }
        }
    };
    const handleDirectoNacional = (lote: lotesType) => {
        setShowTable('directoNacional');
        setLoteSeleccionado(lote);
    };
    const handleDesverdizado = (lote:lotesType) => {
        setShowTable('desverdizado');
        setLoteSeleccionado(lote);
    };
    const volverToTabla = () => {
        setShowTable("table");
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fruta sin procesar</Text>
            <HorizontalLine />
            {showTable === "table" && <View style={styles.containerForm}>
                <Text style={styles.textInputs}>Busqueda</Text>
                <TextInput
                    style={styles.inputs}
                    placeholder=""
                    inputMode="text"
                    onChangeText={(value): void => setFiltro(value)}
                />
            </View>}
            {showTable === "table" &&
                <TablaFruta
                    handleDesverdizado={handleDesverdizado}
                    handleDirectoNacional={handleDirectoNacional}
                    data={data}
                />}
            {showTable === "directoNacional" &&
                <FrutaSinProcesarDirectoNacional volverToTabla={volverToTabla} lote={loteSeleccionado} />}
            {showTable === "desverdizado" &&
                <FrutaSinProcesarDesverdizado
                    volverToTabla={volverToTabla}
                    lote={loteSeleccionado} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        width: '100%',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    containerForm: {
        marginTop: 25,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    inputs: {
        borderWidth: 2,
        borderColor: "skyblue",
        width: 260,
        paddingTop: 5,
        margin: 10,
        borderRadius: 10,
        paddingLeft: 8,
        alignItems: "center",
        backgroundColor: "white",
    },
    textInputs: { marginTop: 5, fontSize: 15, fontWeight: "bold" },

});
