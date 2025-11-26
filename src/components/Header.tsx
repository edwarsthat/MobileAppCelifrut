import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text, } from 'react-native';
const logoImage = require('../../assets/logo_app.png');

type propsType = {
    seleccionWindow: (e: string) => void
}

export default function Header(props: propsType) {

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.menuButton} onPress={(): void => props.seleccionWindow('menu')}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
            <Image source={logoImage} style={styles.logo} />
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
        zIndex: 100000,
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
    botonLotes: {
        backgroundColor: 'white',
        width: 250,
        height: 50,
        marginLeft: '5%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D9F3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerModal: {
        flex: 1,
        alignItems: 'center',
        marginTop: '18%',
    },
    viewModal: {
        backgroundColor: 'white',
        width: '90%',
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
    },
    pressableStyle: {
        marginTop: 10,
        marginBottom: 10,
    },
    textList: {
        color: 'black',
        marginLeft: 10,
        marginRight: 15,
        fontSize: 18,
    },
});
