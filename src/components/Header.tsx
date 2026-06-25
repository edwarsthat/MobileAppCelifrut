import React from 'react';
import { Pressable, Image, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { celifrut } from '../theme/celifrutTokens';
const logoImage = require('../../assets/logo_celifrut.png');

type propsType = {
    seleccionWindow: (e: string) => void
    userName?: string
    userRole?: string
}

export default function Header(props: propsType) {
    const { width } = useWindowDimensions();
    const showUserInfo = width >= 540;

    const name = props.userName?.trim() || 'Usuario';
    const role = props.userRole?.trim() || 'Celifrut';
    const initial = name.charAt(0).toUpperCase();

    return (
        <View style={styles.top}>
            <Pressable
                style={styles.menuBtn}
                onPress={(): void => props.seleccionWindow('menu')}
                hitSlop={6}
            >
                <Feather name="menu" size={22} color={celifrut.brown} />
            </Pressable>

            <Image source={logoImage} style={styles.logo} />

            <View style={styles.spacer} />

            <View style={styles.userChip}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
                {showUserInfo && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName} numberOfLines={1}>{name}</Text>
                        <Text style={styles.userRole} numberOfLines={1}>{role}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,249,240,0.96)',
        borderBottomWidth: 1,
        borderBottomColor: celifrut.borderSoft,
        zIndex: 100000,
    },
    menuBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: celifrut.borderMedium,
        backgroundColor: celifrut.paper,
        borderRadius: 14,
    },
    logo: { width: 96, height: 30, resizeMode: 'contain' },
    spacer: { flex: 1 },
    userChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
        paddingLeft: 6,
        paddingRight: 14,
        backgroundColor: celifrut.paper,
        borderWidth: 1,
        borderColor: celifrut.borderMedium,
        borderRadius: 999,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: celifrut.green,
    },
    avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
    userInfo: { flexDirection: 'column' },
    userName: { fontSize: 13.5, fontWeight: '700', color: celifrut.brown, lineHeight: 16 },
    userRole: { fontSize: 11, color: celifrut.fg4, lineHeight: 13 },
});
