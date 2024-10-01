/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
// import * as Keychain from 'react-native-keychain';
import HeaderFotos from './components/HeaderFotos';
import { lotesType } from '../../../../types/lotesType';
import Camara from './components/Camara';
import useEnvContext from '../../../hooks/useEnvContext';

export default function FotosCalidad(): React.JSX.Element {
    const {url} = useEnvContext();
    const [lote, setLote] = useState<lotesType | null>(null);
    const [lotes, setLotes] = useState<lotesType[]>([]);


    useEffect(() => {
        const obtenerDataPredios = async () => {
            try{
                const responseJSON = await fetch(`${url}/proceso/lotes-fotos-calidad/`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const response = await responseJSON.json();
                if(response.status !== 200){
                    throw new Error(`Code ${response.status}: ${response.message}`);
                }
                setLotes(response.data);
            } catch (err){
                if(err instanceof Error){
                    console.log(err.name,err.message);
                    Alert.alert('Error obteniendo los datos del servidor');
                }
            }
        };
        obtenerDataPredios();
    }, [url]);



    return (
        <View style={styles.container}>
            <HeaderFotos lotes={lotes}  lote={lote} setLote={setLote}/>
            <Camara lote={lote} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
    },
});
