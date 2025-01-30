import React, { useState } from "react";
import { Text, ScrollView, StyleSheet, Alert, Button, View, ActivityIndicator, TextInput } from "react-native";
import { CustomError } from "../../../../Error/Error";
import { formInit, labelForm } from "./function/reduce";
import { FormInitType } from "./types/types";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import { fetchWithTimeout } from "../../../../utils/connection";

export default function PrecioLimon(): React.JSX.Element {
    const { url } = useEnvContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState(formInit);

    const handleChange = (name: keyof FormInitType, value: number): void => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleGuardar = async () =>{
        setLoading(true);
        try{
            const token = await getCredentials();
            const responseJSON = await fetchWithTimeout(`${url}/comercial/ingresar_precio_fruta`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`${token}`,
                },
                body: JSON.stringify({
                    action:"ingresar_precio_fruta",
                    data:{precio:formState, tipoFruta:'Limon'},
                }),
            });
            const response = await responseJSON.json();
            if (response.status !== 200) {
                throw response;
            }
            Alert.alert("Guardado con exito");
        } catch(err){
            if(err instanceof CustomError){
                Alert.alert(`Code ${err.status}: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <View>
                <ActivityIndicator size={'large'} color={'#00ff00'} style={styles.loader} />
            </View>
        );
    }
    return (
        <ScrollView style={styles.constainerScroll}>
            <Text style={styles.titleStyle} >Precio Limon</Text>

            {Object.keys(labelForm).map(key => (
                <View style={styles.containerForm} key={key}>
                    <Text style={styles.textInputs}>{labelForm[key as keyof typeof labelForm]}</Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder="$"
                        inputMode="numeric"
                        onChangeText={(value): void => handleChange(key as keyof FormInitType, Number(value))}

                    />
                </View>
            ))}
            <View style={styles.viewBotones}>
                <Button title="Guardar" color="#49659E" onPress={handleGuardar}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    constainerScroll: {
        width: "100%",
        display: 'flex',
        alignContent: 'center',
        padding: 10,
    },
    titleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 250,
    }, containerForm: {
        marginTop: 10,
        width: '100%',
        display: 'flex',
        alignContent: 'center',
    },
    inputs: {
        borderWidth: 2,
        borderColor: "skyblue",
        width: "auto",
        paddingTop: 5,
        margin: 10,
        borderRadius: 10,
        paddingLeft: 8,
        alignItems: "center",
        backgroundColor: "white",
    },
    textInputs: { marginTop: 5, fontSize: 15, fontWeight: "bold" },
    viewBotones: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        marginBottom:24,
    },
});
