import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

export type OptionItem = { _id: string; name: string };

type ModalOpcionesProps = {
    visible: boolean;
    data: OptionItem[];
    onSelect: (item: OptionItem) => void;
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
                                <Text style={styles.textList}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                    />
                </View>
            </View>
        </Modal>
    );
}
