import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

export type FormInputProps = {
    label: string;
    type?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'password';
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
};

export default function FormInput({
    label,
    type = 'default',
    value,
    onChangeText,
    error,
    placeholder,
    disabled = false,
}: FormInputProps): JSX.Element {
    const [isFocused, setIsFocused] = useState(false);

    const keyboardType =
        type === 'numeric'
            ? 'numeric'
            : type === 'email-address'
                ? 'email-address'
                : type === 'phone-pad'
                    ? 'phone-pad'
                    : 'default';

    const secureTextEntry = type === 'password';

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    disabled && styles.inputDisabled,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={keyboardType as TextInputProps['keyboardType']}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const colors = {
    background: '#fff',
    backgroundHover: '#ececec',
    text: '#000',
    primary: '#7EBA27',
    primaryDark: '#75ac23',
    primaryLight: '#8ecc30',
    borderColor: '#e1e7eb',
    cardBg: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    inputBg: '#f8f9fa',
    inputBorder: '#e1e8ed',
    inputFocus: '#3498db',
    title: '#2c3e50',
    subtitle: '#34495e',
    textSecondary: '#576574',
    borderAccent: '#7EBA27',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
    label: {
        fontSize: 14,
        color: colors.title,
        marginBottom: 4,
    },
    input: {
    width: '100%',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    color: colors.text,
    fontSize: 16,
    },
    inputFocused: {
    borderColor: colors.borderAccent,
    },
    inputDisabled: {
        backgroundColor: colors.backgroundHover,
    },
    error: {
        marginTop: 4,
        color: '#E74C3C',
        fontSize: 12,
    },
});
