import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from "react";
import { CargoType } from '../../../types/cargosType';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Inventarios(props: propsType): React.JSX.Element {
    const fruta_sin_procesar = useRef(new Animated.Value(1)).current;
    const orden_vaceo = useRef(new Animated.Value(1)).current;
    const inventario_cuartos_frios = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();

    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos['Inventario y Logística'].Inventarios);
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

            {permisos?.includes('Fruta sin procesar') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b66e8d77549ed0672a9015")}
                    onPressIn={() => handlePressIn(fruta_sin_procesar)}
                    onPressOut={() => handlePressOut(fruta_sin_procesar)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: fruta_sin_procesar }] }]}>
                        <Icon name="dropbox" size={24} color="#fff" />
                        <Text style={styles.text}>Fruta sin procesar</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Orden de vaceo') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b66ece77549ed0672a9018")}
                    onPressIn={() => handlePressIn(orden_vaceo)}
                    onPressOut={() => handlePressOut(orden_vaceo)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: orden_vaceo }] }]}>
                        <Icon name="dropbox" size={24} color="#fff" />
                        <Text style={styles.text}>Orden de vaceo</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Inventario Cuartos Fríos') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("68c86c1799dddf63af97548e")}
                    onPressIn={() => handlePressIn(inventario_cuartos_frios)}
                    onPressOut={() => handlePressOut(inventario_cuartos_frios)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: inventario_cuartos_frios }] }]}>
                        <Icon name="dropbox" size={24} color="#fff" />
                        <Text style={styles.text}>Inventario Cuartos Fríos</Text>
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
