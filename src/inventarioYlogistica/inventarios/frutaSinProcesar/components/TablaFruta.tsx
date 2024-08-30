/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { lotesType } from "../../../../../types/lotesType";
import TaejetaLote from "./TarjetaLote";

type propstType = {
    data: lotesType[] | undefined
    handleDirectoNacional: (lote: lotesType) => void
    handleDesverdizado: (lote: lotesType) => void
}

export default function TablaFruta(props: propstType): React.JSX.Element {
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
                <TaejetaLote
                    data={item}
                    handleDirectoNacional={props.handleDirectoNacional}
                    handleDesverdizado={props.handleDesverdizado}
                />
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
