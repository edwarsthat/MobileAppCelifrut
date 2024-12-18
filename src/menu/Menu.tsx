import React, { useState, useRef, useEffect } from 'react';
import { CargoType } from '../../types/cargosType';
import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Menu(props: propsType): React.JSX.Element {
    const inventario = useRef(new Animated.Value(1)).current;
    const calidad = useRef(new Animated.Value(1)).current;
    const sistema = useRef(new Animated.Value(1)).current;
    const proceso = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();


    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos);
            setPermisos(perm);
        }
    }, [props.permisos]);

    if (props.permisos === undefined) {
        return (
            <View>
                <Text>No hay permisos...</Text>
            </View>
        );
    }

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
            {permisos?.includes('Inventario y Logística') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("Inventario y Logística")}
                    onPressIn={() => handlePressIn(inventario)}
                    onPressOut={() => handlePressOut(inventario)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: inventario }] }]}>
                        <Icon name="dropbox" size={24} color="#fff" />
                        <Text style={styles.text}>Inventario y Logística</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Calidad') && (
                <TouchableWithoutFeedback
                    onPressIn={() => handlePressIn(calidad)}
                    onPressOut={() => handlePressOut(calidad)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: calidad }] }]}>
                        <Icon name="flask" size={24} color="#fff" />
                        <Text style={styles.text}>Calidad</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Sistema') && (
                <TouchableWithoutFeedback
                    onPressIn={() => handlePressIn(sistema)}
                    onPressOut={() => handlePressOut(sistema)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: sistema }] }]}>
                        <Icon name="cog" size={24} color="#fff" />
                        <Text style={styles.text}>Sistema</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {permisos?.includes('Proceso') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("Proceso")}
                    onPressIn={() => handlePressIn(proceso)}
                    onPressOut={() => handlePressOut(proceso)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: proceso }] }]}>
                        <Icon name="play-circle-o" size={24} color="#fff" />
                        <Text style={styles.text}>Proceso</Text>
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
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f4f4f8', // Fondo claro para el menú
//         padding: 16,
//         width: '100%',
//         justifyContent: 'center',
//     },
//     container2:{
//         alignItems:'center',
//     },
//     areaButtonsStyle: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 250,
//         height: 50,
//         borderRadius: 10,
//         marginTop: 15,
//         backgroundColor: '#7D9F3A',
//     },
//     textAreaButtonStyle: {
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     elementoButtonStyle: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 250,
//         height: 30,
//         borderRadius: 10,
//         marginTop: 8,
//         backgroundColor: '#E6E6EB',
//     },
//     itemViwStyle: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     itemButtonStyle: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 200,
//         height: 50,
//         borderRadius: 10,
//         marginTop: 8,
//         backgroundColor: '#5B89EB',
//     },
//     itemTextStyle: {
//         color: 'white',
//     },
// });
