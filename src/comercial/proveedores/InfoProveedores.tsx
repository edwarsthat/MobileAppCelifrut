import { StyleSheet, View, Text, Alert, FlatList, TextInput, Dimensions } from "react-native";
import HorizontalLine from "../../components/HorizontalLine";
import React, { useEffect, useState } from "react";
import useEnvContext from "../../hooks/useEnvContext";
import { proveedoresType } from "../../../types/proveedoresType";
import { getCredentials } from "../../../utils/auth";
import { useAppContext } from "../../hooks/useAppContext";
import TarjetaProveedor from "./components/TarjetaProveedor";

export default function InfoProveedores(): React.JSX.Element {
    const { url } = useEnvContext();
    const { setLoading } = useAppContext();
    const [data, setData] = useState<proveedoresType[]>();
    const [dataOriginal, setDataOriginal] = useState<proveedoresType[]>();
    const [filtro, setFiltro] = useState<string>('');
    useEffect(() => {
        const obtenerRegistros = async () => {
            try {
                setLoading(true);
                const token = await getCredentials();
                const requesOperariosJSON = await fetch(`${url}/comercial/get_comercial_proveedores_elementos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `${token}`,
                    },
                });
                const response = await requesOperariosJSON.json();
                console.log(response);
                if (response.status !== 200) {
                    throw new Error(`Cose ${response.status}: ${response.message}`);
                }
                console.log(response);
                setDataOriginal(response.data);
                setData(response.data);
            } catch (err) {
                if (err instanceof Error) {
                    Alert.alert(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        obtenerRegistros();
    }, []);
    useEffect(() => {
        if (dataOriginal !== undefined && filtro !== '') {
            const datos = dataOriginal.filter(proveedor =>
            (proveedor.PREDIO.toLowerCase().includes(filtro.toLowerCase()) ||
            proveedor["CODIGO INTERNO"] === Number(filtro)));
            console.log(datos);
            if(datos.length === 0) {setData(undefined);}
            setData(datos);

        } else if (filtro === '') {
            setData(dataOriginal);
        }
    }, [filtro, dataOriginal]);
    if (data === undefined) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Proveedores</Text>
                <HorizontalLine />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Proveedores</Text>
            <HorizontalLine />
            <View style={styles.containerForm}>
                <Text style={styles.textInputs}>Búsqueda</Text>
                <TextInput
                    testID="proveedores_buscar_text_input"
                    style={styles.inputs}
                    placeholder="Ingrese Codigo o predio"
                    inputMode="text"
                    onChangeText={(value) => setFiltro(value)}
                    value={filtro}
                />
            </View>
            <FlatList
                data={data}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TarjetaProveedor proveedor={item} />
                )}
            />
        </View>
    );
}

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingTop: 10,
    },
    title: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    containerForm: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    textInputs: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    inputs: {
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        width: width * 0.85,
        paddingVertical: 5,
        marginTop: 12,
        borderRadius: 12,
        paddingLeft: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
});
