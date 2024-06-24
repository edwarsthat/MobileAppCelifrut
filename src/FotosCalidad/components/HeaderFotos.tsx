/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type propsType = {
    lote: string
    setLote: (e:string) => void
}

export default function HeaderFotos(props:propsType): React.JSX.Element {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    return (
        <View>
            <TouchableOpacity style={styles.botonLotes}
                onPress={() => setModalVisible(true)}>
                <Text>{props.lote}</Text>
            </TouchableOpacity>
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
});
