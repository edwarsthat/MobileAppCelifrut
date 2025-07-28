import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type RadioButtonGroupProps = {
    options: string[];
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
                    <TouchableOpacity key={option + idx} onPress={() => onSelect(option)}>
                        <View style={styles.radioButton}>
                            <View style={styles.radio}>{value === option ? <View style={styles.radioBg} /> : null}</View>
                            <Text>{option}{optionSuffix}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
