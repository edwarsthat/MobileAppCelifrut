import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { lotesType } from "../../../../../types/lotesType";
import TaejetaLote from "./TarjetaLote";
import { useAppContext } from "../../../../hooks/useAppContext";

type propstType = {
    data: lotesType[] | undefined
}

export default function TablaFruta(props: propstType): React.JSX.Element {
    const { setLoading } = useAppContext();
    useEffect(()=>{
        if( props.data === undefined){
            setLoading(true);
        } else {
            setLoading(false);
        }
    },[props.data]);
    return (
        <FlatList
            data={props.data}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <TaejetaLote
                    data={item}
                />
            )}
            contentContainerStyle={styles.flatListContent}
        />

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    flatListContent: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    centeredContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        marginTop: 250,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        fontStyle: 'italic',
    },
    separator: {
        height: 12,
    },
});
