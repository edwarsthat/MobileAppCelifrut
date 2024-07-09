/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Dimensions, Button, Alert } from 'react-native';
import { procesarPermisos } from '../functions/dataTransformation';
import * as Keychain from 'react-native-keychain';

type propsType = {
    showLoading: () => void
    setIslogin: (e: boolean) => void
    setPermisos: (e: string[]) => void
}

export default function Login(props: propsType): React.JSX.Element {
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<number>(0);
    const handlelogin = async (): Promise<void> => {
        try{
            const responseJSON = await fetch('http://192.168.0.172:3010/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    password: password,
                }),
            });
            const response = await responseJSON.json();
            if (response.status === 401) {
                setError(401);
                setTimeout(() => {
                    setError(0);
                }, 3000);
                return;
            } else if (response.status === 402) {
                setError(402);
                setTimeout(() => {
                    setError(0);
                }, 3000);
                return;
            }
            else if (response.status === 200) {
                const data = procesarPermisos(response.permisos);
                props.showLoading();
                props.setIslogin(true);
                props.setPermisos(data);
                await Keychain.setGenericPassword('user', response.accesToken);
            }
        } catch(err){
            if(err instanceof Error){
                Alert.alert(`Error: ${err.message}`);
            }
        }
    };
    const handleUser = (e:string) => {
        setUser(e.toLowerCase().trim());
    };
    return <View style={styles.container}>
        <Image style={styles.imgStyle} source={require('../../assets/CELIFRUT.png')} />
        <View>
            <Text style={styles.textStyle}>Usuario</Text>
            <TextInput style={styles.inputStyle} onChangeText={handleUser} />
            <Text style={styles.errorStyle}>{error === 401 && 'Error en el usuario'}</Text>
            <Text style={styles.textStyle}>Contraseña</Text>
            <TextInput
                onChangeText={setPassword}
                style={styles.inputStyle}
                textContentType="password"
                secureTextEntry={true}
            />
            <Text style={styles.errorStyle}>{error === 402 && 'Error en la contraseña'}</Text>
        </View>
        <Button title="Iniciar" color="#7D9F3A" onPress={handlelogin} />
    </View>;
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight,
        marginBottom: 150,
    },
    imgStyle: {
        width: 150,
        height: 150,
    },
    textStyle: {
        fontSize: 20,
        marginTop: 10,
    },
    errorStyle: {
        color: 'red',
    },
    inputStyle: {
        borderWidth: 2,
        borderColor: 'skyblue',
        width: 250,
        paddingTop: 5,
        margin: 10,
        borderRadius: 10,
        paddingLeft: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    containerFooter: {
        bottom: 0,
        backgroundColor: '#7D9F3A',
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    imageFooter: {
        width: 60,
        height: 60,
    },
});
