/* eslint-disable prettier/prettier */
//esta pendiente porque no tengo fruta desverdizando y me da pereza meter
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import HorizontalLine from "../../../components/HorizontalLine";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { lotesType } from "../../../../types/lotesType";
import TablaInventarioDesverdizado from "./components/TablaInventarioDesverdizado";

export default function InventarioDesverdizado(): React.JSX.Element {
    const { url } = useEnvContext();
    const [filtro, setFiltro] = useState<string>('');
    const [data, setData] = useState<lotesType[]>();
    const [dataOriginal, setDataOriginal] = useState<lotesType[]>();
    const [showTable, setShowTable] = useState<string>("table");

    useEffect(() => {
        const obtenerFruta = async () => {
            try {
                const token = await getCredentials();
                const requesOperariosJSON = await fetch(`${url}/proceso/getInventarioDesverdizado`, {
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
        obtenerFruta();
    }, [url]);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fruta desverdizando</Text>
            <HorizontalLine />
            <Text style={styles.textInputs}>Busqueda</Text>
            <TextInput
                style={styles.inputs}
                placeholder=""
                inputMode="text"
                onChangeText={(value): void => setFiltro(value)}
            />
            {showTable === "table" &&
                <TablaInventarioDesverdizado data={data}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
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
