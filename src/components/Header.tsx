/* eslint-disable prettier/prettier */
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
const logoImage = require('../../assets/logo_app.png');

type propsType = {
    seleccionWindow: (e: string) => void
}

export default function Header(props: propsType) {

    return (
        <View style={styles.headerContainer}>
            {/* Botón de menú */}
            <TouchableOpacity style={styles.menuButton} onPress={():void => props.seleccionWindow('menu')}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>

            {/* Imagen o logo */}
            <Image source={logoImage} style={styles.logo} />

            {/* Espacio vacío para balancear el diseño */}
            <View style={styles.placeholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: '100%', // Ocupa todo el ancho disponible
        height: 60,
        backgroundColor: '#fff', // Fondo blanco para resaltar
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    menuButton: {
        padding: 8,
    },
    menuText: {
        fontSize: 24,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    placeholder: {
        width: 32,
    },
});
