/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import React from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';

type propsType = {
    seleccionWindow: (e:string) => void
}

export default function Header(props:propsType) {

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button title="inicio" onPress={():void => props.seleccionWindow('menu')}/>
            </View>
            <Image source={require('../../assets/CELIFRUT.webp')} style={styles.image} />
            <View style={styles.buttons}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        top: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 90,

    },
    image: {
        top: 0,
        width: 60,
        height: 60,
    },
    buttons: {
        height: '100%',
        marginTop: 60,
        marginRight: '20%',
        flex: 0.5,
    },
});