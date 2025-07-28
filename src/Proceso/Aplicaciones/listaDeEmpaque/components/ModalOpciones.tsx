import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type ModalOpcionesProps = {
    visible: boolean;
    data: string[];
    onSelect: (item: string) => void;
    onClose?: () => void;
    styles: { [key: string]: any };
};

export function ModalOpciones({ visible, data, onSelect, onClose, styles }: ModalOpcionesProps): React.JSX.Element {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styles.centerModal}>
                <View style={styles.viewModalItem}>
                    <FlatList
                        data={data}
                        style={styles.pressableStyle}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.buttonContenedores}
                                onPress={() => {
                                    onSelect(item);
                                    if (onClose) { onClose(); }
                                }}
                            >
                                <Text style={styles.textList}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                    />
                </View>
            </View>
        </Modal>
    );
}
