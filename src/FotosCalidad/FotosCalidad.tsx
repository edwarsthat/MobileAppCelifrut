/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
// import * as Keychain from 'react-native-keychain';
import HeaderFotos from './components/HeaderFotos';

export default function FotosCalidad(): React.JSX.Element {
    const [lote, setLote] = useState<string>('Seleccionar Lote');

    useEffect(() => {
        // obtenerToken();
        obtenerDataPredios();
    }, []);
    // const obtenerToken = async () => {
    //     try {
    //         const credentials = await Keychain.getGenericPassword();
    //         if (credentials) {
    //             console.log(credentials.password);
    //         }
    //     } catch (error) {
    //         console.error('Error retrieving the token securely', error);
    //     }
    // };
    const obtenerDataPredios = async () => {
        try{
            const responseJSON = await fetch('http://192.168.0.172:3010/proceso/lotes-fotos-calidad/',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const response = await responseJSON.json();
            console.log(response);
        } catch (err){
            if(err instanceof Error){
                console.log(err.name,err.message);
                Alert.alert('Error obteniendo los datos del servidor');
            }
        }
    };

    return (
        <View style={styles.container}>
            <HeaderFotos  lote={lote} setLote={setLote}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
