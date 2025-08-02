
import React from "react";
import { StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { lotesType } from "../../../../../types/lotesType";
import TarjetaLoteDesverdizado from "./TarjetaLoteDesverdizado";

type propstType = {
    data: lotesType[] | undefined
}
export default function TablaInventarioDesverdizado(props:propstType):React.JSX.Element{
    if (props.data === undefined) {
        return (
            <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
        );
    }
    return (

        <FlatList
            data={props.data}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <TarjetaLoteDesverdizado
                    data={item}/>
            )}
            contentContainerStyle={styles.flatListContent}
        />

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContent: {
        flexGrow: 1,
    },
    loader: {
        marginTop: 250,
    },
});
