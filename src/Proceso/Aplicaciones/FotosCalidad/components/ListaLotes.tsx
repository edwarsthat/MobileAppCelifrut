import React from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { lotesType } from '../../../../../types/lotesType';

type Props = {
    data: lotesType[];
    onSelect: (item: lotesType) => void;
}

export default function ListaLotes({ data, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
                        <Text style={styles.text}>ENF: {item.enf}</Text>
                        <Text style={styles.text}>Predio: {item.predio?.PREDIO || 'N/A'}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        color: '#333',
    }
});
