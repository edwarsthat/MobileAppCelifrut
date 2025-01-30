import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { proveedoresType } from "../../../../types/proveedoresType";

type propsType = {
    proveedor: proveedoresType
}

export default function TarjetaProveedor(props: propsType): React.JSX.Element {
    return (
        <View style={styles.cardContainer}>
            {/* Encabezado principal */}
            <Text style={styles.headerText}>
                Codigo {props.proveedor['CODIGO INTERNO'] ?? ''}
            </Text>

            {/* Información general */}
            <View style={styles.infoRow}>
                <Text style={styles.label}>Predio:</Text>
                <Text style={styles.value}>{props.proveedor.PREDIO ?? ''}</Text>
            </View>

            {/* Sección ICA */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ICA</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Código:</Text>
                    <Text style={styles.value}>{props.proveedor.ICA && props.proveedor.ICA.code}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tipo de Fruta:</Text>
                    <Text style={styles.value}>{
                        props.proveedor.ICA &&
                        props.proveedor.ICA.tipo_fruta &&
                        props.proveedor.ICA.tipo_fruta.reduce((acu, item) => (acu += item + ', '), '')
                    }</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Vencimiento:</Text>
                    <Text style={styles.value}>{
                    props.proveedor.ICA && props.proveedor.ICA.fechaVencimiento}</Text>
                </View>
            </View>

            {/* Sección GGN */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>GGN</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Código:</Text>
                    <Text style={styles.value}>{props.proveedor?.GGN?.code ?? ''}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tipo de Fruta:</Text>
                    <Text style={styles.value}>{
                        props.proveedor.GGN &&
                        props.proveedor.GGN.tipo_fruta &&
                        props.proveedor.GGN.tipo_fruta.reduce((acu, item) => (acu += item + ', '), '')
                    }</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Vencimiento:</Text>
                    <Text style={styles.value}>{props.proveedor.GGN && props.proveedor.GGN.fechaVencimiento }</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',     // Fondo de tarjeta
        marginHorizontal: 16,          // Separación horizontal
        marginVertical: 8,             // Separación vertical
        padding: 16,                   // Espacio interno
        borderRadius: 8,               // Esquinas redondeadas
        // Sombra en iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra en Android
        elevation: 2,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
    infoRow: {
        flexDirection: 'row',          // Para ubicar label y valor en línea
        marginBottom: 4,
    },
    label: {
        fontWeight: '600',
        color: '#555555',
        marginRight: 4,
    },
    value: {
        color: '#777777',
    },
    section: {
        marginTop: 12,                 // Separación superior
        paddingTop: 8,                 // Padding interno superior
        borderTopWidth: 1,             // Línea para separar secciones
        borderTopColor: '#EEEEEE',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
});
