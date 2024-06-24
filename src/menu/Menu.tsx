/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type propsType = {
    permisos: string[]
    seleccionWindow: (e:string) => void
}

export default function Menu(props: propsType): React.JSX.Element {
    const [areaState, setAreaState] = useState<string[]>([]);
    const [elementoState, setElementoState] = useState<string[][]>([]);
    const [permisos, setPermisos] = useState<string[][]>([]);
    const [areaSelect, setAreaSelect] = useState<number[]>([]);
    const [elementSelect, setElementSelect] = useState<number[]>([]);


    useEffect(() => {
        const areas: string[] = [];
        const elementos: string[] = [];

        const permisosArr = props.permisos.map(item => {
            const [area, elemento, permiso] = item.split('//');
            areas.push(area);
            elementos.push(area + '//' + elemento);
            return [area, elemento, permiso];
        });
        const areaSet = new Set(areas);
        const elementosSet = new Set(elementos);
        const areaArr = [...areaSet];
        const elementosArr = [...elementosSet];
        const elementoArr2 = elementosArr.map(elementoArr => {
            const [area, elemento] = elementoArr.split('//');
            return [area, elemento];
        });
        setAreaState(areaArr);
        setElementoState(elementoArr2);
        setPermisos(permisosArr);
    }, [props.permisos]);
    const handleClickArea = (index: number): void => {
        if (areaSelect.includes(index)) {
            const indexToRemove = areaSelect.findIndex(item => item === index);
            setAreaSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
        } else {
            setAreaSelect(prevState => [...prevState, index]);
        }
    };
    const handleClickElement = (index: number): void => {
        if (elementSelect.includes(index)) {
            const indexToRemove = elementSelect.findIndex(item => item === index);
            setElementSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
        } else {
            setElementSelect(prevState => [...prevState, index]);
        }
    };
    return <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
            {areaState.map((area, index) => (
                <View key={area}>
                    <TouchableOpacity style={styles.areaButtonsStyle} onPress={(): void => handleClickArea(index)}>
                        <Text style={styles.textAreaButtonStyle}>{area}</Text>
                    </TouchableOpacity>
                    {areaSelect.includes(index) ?
                        <View>
                            {elementoState.map((itemElemento, indexElemento) => {
                                if (itemElemento[0] === area) {
                                    return (
                                        <Fragment key={indexElemento}>
                                            <View>
                                                <TouchableOpacity onPress={(): void => handleClickElement(indexElemento)} style={styles.elementoButtonStyle}>
                                                    <Text>{itemElemento[1]}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {elementSelect.includes(indexElemento) ?
                                            <View>
                                                {permisos.map((permiso, indexPermiso) => {
                                                    if( permiso[1] === itemElemento[1] && permiso[0] === area){
                                                        return(
                                                            <Fragment key={permiso[2] + indexPermiso}>
                                                                <View style={styles.itemViwStyle}>
                                                                    <TouchableOpacity
                                                                        onPress={():void => props.seleccionWindow(permiso[0] + '//' + permiso[1] + '//' + permiso[2])}
                                                                        style={styles.itemButtonStyle}>
                                                                        <Text style={styles.itemTextStyle}>
                                                                        {permiso[2]}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </Fragment>
                                                        );
                                                    }
                                                })}
                                            </View>
                                            :
                                            null
                                            }
                                        </Fragment>
                                    );
                                }
                            })}
                        </View>
                        : null
                    }
                </View>
            ))}
        </ScrollView>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 'auto',
    },
    scrollContainer: {
        width: '100%',
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
    itemViwStyle:{
        justifyContent:'center',
        alignItems:'center',
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
    itemTextStyle:{
        color:'white',
    },
});
