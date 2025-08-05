import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type RadioButtonGroupProps = {
    options: { _id: string; name: string }[];
    value: string;
    onSelect: (val: string) => void;
    label?: string;
    optionSuffix?: string;
    styles: { [key: string]: any };
};
export default function RadioButtonGroup({ options, value, onSelect, label, optionSuffix, styles }: RadioButtonGroupProps) {
    return (
        <View style={styles.containerConfigurarPallet}>
            {label && <Text>{label}</Text>}
            <View style={styles.viewCalidad}>
                {options.map((option, idx) => (
                    <TouchableOpacity key={option._id + idx} onPress={() => onSelect(option._id)}>
                        <View style={styles.radioButton}>
                            <View style={styles.radio}>{value === option._id ? <View style={styles.radioBg} /> : null}</View>
                            <Text>{option.name}{optionSuffix}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
