import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from "react";
import { CargoType } from '../../../types/cargosType';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}


export default function HistorialAplicaciones(props: propsType): React.JSX.Element {
    const lavado = useRef(new Animated.Value(1)).current;
    const encerado = useRef(new Animated.Value(1)).current;
    const fotos = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();

    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos.Proceso['Historiales Aplicaciones']);
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

            {permisos?.includes('Descarte lavado') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b6708677549ed0672a902a")}
                    onPressIn={() => handlePressIn(lavado)}
                    onPressOut={() => handlePressOut(lavado)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: lavado }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Descarte Lavado</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}


            {permisos?.includes('Descarte Encerado') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b6708f77549ed0672a902b")}
                    onPressIn={() => handlePressIn(encerado)}
                    onPressOut={() => handlePressOut(encerado)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: encerado }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Descarte Encerado</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Fotos calidad') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b6709877549ed0672a902c")}
                    onPressIn={() => handlePressIn(fotos)}
                    onPressOut={() => handlePressOut(fotos)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: fotos }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Fotos Calidad</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
