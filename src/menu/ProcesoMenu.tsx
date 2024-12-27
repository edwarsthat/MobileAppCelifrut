import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CargoType } from "../../types/cargosType";
import React, { useEffect, useRef, useState } from "react";

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function ProcesoMenu(props: propsType): React.JSX.Element {
    const aplicaciones = useRef(new Animated.Value(1)).current;
    const historiales_aplicaciones = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();

    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos.Proceso);
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
            {permisos?.includes('Aplicaciones') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("Proceso/Aplicaciones")}
                    onPressIn={() => handlePressIn(aplicaciones)}
                    onPressOut={() => handlePressOut(aplicaciones)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: aplicaciones }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Aplicaciones</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Historiales Aplicaciones') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("Proceso/historiales_aplicaciones")}
                    onPressIn={() => handlePressIn(historiales_aplicaciones)}
                    onPressOut={() => handlePressOut(historiales_aplicaciones)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: historiales_aplicaciones }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Historiales Aplicaciones</Text>
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
