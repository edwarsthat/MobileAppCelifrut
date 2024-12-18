import React from "react";
import { Modal, StyleSheet, View, ActivityIndicator, Text } from "react-native";

type propsType = {
    visible: boolean
}

export default function LoadingModal(props: propsType): React.JSX.Element {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={props.visible}
            onRequestClose={() => { }} >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo semitransparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff', // Fondo del modal
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
});
