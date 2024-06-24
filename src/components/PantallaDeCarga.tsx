/* eslint-disable prettier/prettier */
import React from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

export default function PantallaDeCarga(): React.JSX.Element{
    return <SafeAreaView style={styles.container}>
        <ActivityIndicator size={150} color="#7D9F3A" />
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignContent:'center',
    },
});
