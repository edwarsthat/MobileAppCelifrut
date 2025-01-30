import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, { useEffect, useRef, useState } from "react";
import { CargoType } from '../../../types/cargosType';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Proveedores(props: propsType): React.JSX.Element {
    const info_proveedores = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();

    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos.Comercial.Proveedores);
            setPermisos(perm);
        }
    }, [props.permisos]);

    const handlePressIn = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 0.9, // Reducir el tamaño al presionar
            useNativeDriver: true,
        }).start();
    };
    const handlePressOut = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 1, // Restaurar el tamaño original
            useNativeDriver: true,
        }).start();
    };
    return (
        <View style={styles.container}>

            {permisos?.includes('Información Proveedores') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b670ca77549ed0672a9030")}
                    onPressIn={() => handlePressIn(info_proveedores)}
                    onPressOut={() => handlePressOut(info_proveedores)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: info_proveedores }] }]}>
                        <Icon name="store-alt" size={24} color="#fff" />
                        <Text style={styles.text}>Información proveedores</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, // Hace que el contenedor ocupe todo el espacio disponible
        alignItems: 'center', // Centra horizontalmente
        backgroundColor: '#f5f5f5', // Fondo opcional para visualizar el centrado
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7D9F3A',
        gap: 9,
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: '95%',
        marginTop: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
