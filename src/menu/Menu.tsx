/* eslint-disable prettier/prettier */
import React, { useState, Fragment } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CargoType } from '../../types/cargosType';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}
type ValidAreaKeys = Exclude<keyof CargoType, '_id' | 'Rol' | 'Cargo' | 'createdAt'>;

export default function Menu(props: propsType): React.JSX.Element {

    const [areaSelect, setAreaSelect] = useState<string[]>([]);
    const [elementSelect, setElementSelect] = useState<string[]>([]);


    const handleClickArea = (index: string): void => {
        if (areaSelect.includes(index)) {
            const indexToRemove = areaSelect.findIndex(item => item === index);
            setAreaSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
        } else {
            setAreaSelect(prevState => [...prevState, index]);
        }
    };

    const handleClickElement = (index: string): void => {
        if (elementSelect.includes(index)) {
            const indexToRemove = elementSelect.findIndex(item => item === index);
            setElementSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
        } else {
            setElementSelect(prevState => [...prevState, index]);
        }
    };

    if (props.permisos === undefined) {
        return (
            <View>
                <Text>No hay permisos...</Text>
            </View>
        );
    }
    return <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
            {Object.keys(props.permisos).map((area) => {
                if (!['_id', 'Rol', 'Cargo', 'createdAt', '__v'].includes(area)) {
                    const validArea = area as ValidAreaKeys;
                    return (
                        <View key={area}>
                            <TouchableOpacity style={styles.areaButtonsStyle} onPress={(): void => handleClickArea(area)} >
                                <Text style={styles.textAreaButtonStyle}>{area}</Text>
                            </TouchableOpacity>
                            {areaSelect.includes(area) ?
                                <View>
                                    {props.permisos && (Object.entries(props.permisos[validArea])).map(([itemElemento, ventana]) => (
                                        <Fragment key={itemElemento}>
                                            <View>
                                                <TouchableOpacity onPress={(): void => handleClickElement(itemElemento)} style={styles.elementoButtonStyle}>
                                                    <Text>{itemElemento}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {elementSelect.includes(itemElemento) ?
                                                <View>
                                                    {Object.entries(ventana).map(([permisoKey, permisoValue]) => {
                                                        return (
                                                            <Fragment key={permisoKey + permisoValue}>
                                                                <View style={styles.itemViwStyle}>
                                                                    <TouchableOpacity
                                                                        onPress={(): void => props.seleccionWindow(permisoValue._id)}
                                                                        style={styles.itemButtonStyle}>
                                                                        <Text style={styles.itemTextStyle}>
                                                                            {permisoKey}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </Fragment>
                                                        );

                                                    })}
                                                </View>
                                                :
                                                null
                                            }
                                        </Fragment>

                                    ))}
                                </View>
                                : null
                            }
                        </View>
                    );
                } else { return null; }
            })}
        </ScrollView>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8', // Fondo claro para el menú
        padding: 16,
    },
    scrollContent: {
        alignItems: 'center',
    },
    areaButtonsStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 50,
        borderRadius: 10,
        marginTop: 15,
        backgroundColor: '#7D9F3A',
    },
    textAreaButtonStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    elementoButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 30,
        borderRadius: 10,
        marginTop: 8,
        backgroundColor: '#E6E6EB',
    },
    itemViwStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 50,
        borderRadius: 10,
        marginTop: 8,
        backgroundColor: '#5B89EB',
    },
    itemTextStyle: {
        color: 'white',
    },
});
