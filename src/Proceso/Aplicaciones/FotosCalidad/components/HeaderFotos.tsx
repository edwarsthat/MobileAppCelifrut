/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { lotesType } from '../../../../../types/lotesType';

type propsType = {
    lote: lotesType | null
    setLote: (e: lotesType) => void
    lotes: lotesType[] | []
}

export default function HeaderFotos(props: propsType): React.JSX.Element {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    if(!props.lotes) {return(<View><Text>Cargando...</Text></View>);}
    return (
        <View>
            <TouchableOpacity style={styles.botonLotes}
                onPress={() => setModalVisible(true)}>
                <Text>{props.lote ? props.lote.enf + " " + props.lote.predio.PREDIO : 'Seleccione predio'}</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centerModal}>
                    <View style={styles.viewModal}>

                        <FlatList
                            data={props.lotes}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pressableStyle}
                                    onPress={() => {
                                        props.setLote(item);
                                        setModalVisible(false);
                                    }}>
                                    <Text style={styles.textList}>{item.enf} -- {item.predio.PREDIO}</Text>
                                </TouchableOpacity>)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
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
    centerModal:{
        flex: 1,
        alignItems: 'center',
        marginTop:'18%',
      },
      viewModal:{
        backgroundColor: 'white',
        width: '90%',
        flexDirection: 'row',
        borderRadius: 20,
        alignItems:'center',
        paddingBottom: 20,
        paddingTop:10,
      },
      pressableStyle:{
        marginTop: 10,
        marginBottom: 10,
      },
      textList:{
        color: 'black',
        marginLeft:10,
        marginRight: 15,
        fontSize: 18,
      },
});
