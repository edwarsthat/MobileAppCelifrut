import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function Footer(): React.JSX.Element {
    return <View style={styles.containerFooter}>
        <Image style={styles.imageFooter} source={require('../../assets/CELIFRUT.webp')} />
    </View>;
}

const styles = StyleSheet.create({
    containerFooter: {
        bottom: 0,
        backgroundColor: '#7D9F3A',
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    imageFooter: {
        width: 60,
        height: 60,
    },
});
