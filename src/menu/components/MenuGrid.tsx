import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    Pressable,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import { celifrut } from '../../theme/celifrutTokens';

export type IconLib = 'feather' | 'mci';

export type MenuItem = {
    /** Identificador único para React keys. */
    key: string
    /** Título visible de la tarjeta. */
    label: string
    desc?: string
    lib: IconLib
    icon: string
    /** Navegación. Si se omite, la tarjeta no navega (se mantiene la lógica original). */
    onPress?: () => void
    /** Acento opcional; si no se da, se asigna por posición desde la paleta de marca. */
    accent?: string
    shadow?: string
}

type Props = {
    eyebrow: string
    title: string
    subtitle?: string
    items: MenuItem[]
    /** El pie con versión solo se muestra en el menú principal. */
    showFooter?: boolean
}

// Paleta de marca: da ritmo visual a las tarjetas. El orden coincide con el
// menú principal (verde, naranja, café, verde oscuro, amarillo).
const PALETTE = [
    { accent: '#7DBE2A', shadow: 'rgba(94,154,28,0.30)' },
    { accent: '#F39521', shadow: 'rgba(216,122,10,0.30)' },
    { accent: '#8C5A30', shadow: 'rgba(110,58,20,0.28)' },
    { accent: '#5E9A1C', shadow: 'rgba(94,154,28,0.30)' },
    { accent: '#F5C42B', shadow: 'rgba(224,166,16,0.32)' },
];

function ModIcon({ lib, name, size, color }: { lib: IconLib; name: string; size: number; color: string }) {
    if (lib === 'mci') {
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
    }
    return <Feather name={name} size={size} color={color} />;
}

function ModuleCard({ item, accent, shadow, width }: { item: MenuItem; accent: string; shadow: string; width: number }) {
    const [pressed, setPressed] = useState(false);
    return (
        <Pressable
            onPress={item.onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[styles.mod, { width }, pressed && styles.modPressed]}
        >
            <View style={[styles.accentStrip, { backgroundColor: accent }]} />
            <View style={styles.modTop}>
                <View style={[styles.modIcon, { backgroundColor: accent, shadowColor: shadow }]}>
                    <ModIcon lib={item.lib} name={item.icon} size={26} color="#FFFFFF" />
                </View>
                <Feather
                    name="chevron-right"
                    size={22}
                    color={pressed ? accent : celifrut.fg4}
                    style={pressed ? styles.chevPressed : undefined}
                />
            </View>
            <View style={styles.modBody}>
                <Text style={styles.modTitle}>{item.label}</Text>
                {!!item.desc && <Text style={styles.modDesc}>{item.desc}</Text>}
            </View>
        </Pressable>
    );
}

export default function MenuGrid({ eyebrow, title, subtitle, items, showFooter }: Props): React.JSX.Element {
    const { width: winW } = useWindowDimensions();

    const H_PAD = 20;
    const GAP = 16;
    const cols = winW >= 900 ? 3 : winW >= 600 ? 2 : 1;
    const contentW = Math.min(winW, 1180) - H_PAD * 2;
    const cardW = (contentW - GAP * (cols - 1)) / cols;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
            <View style={[styles.page, { paddingHorizontal: H_PAD }]}>
                <View style={styles.head}>
                    <Text style={styles.eyebrow}>{eyebrow}</Text>
                    <Text style={styles.title}>{title}</Text>
                    {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
                </View>

                {items.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No tienes módulos asignados.</Text>
                        <Text style={styles.emptyText}>Contacta al administrador del sistema.</Text>
                    </View>
                ) : (
                    <View style={[styles.grid, { gap: GAP }]}>
                        {items.map((item, i) => {
                            const pal = PALETTE[i % PALETTE.length];
                            return (
                                <ModuleCard
                                    key={item.key}
                                    item={item}
                                    accent={item.accent ?? pal.accent}
                                    shadow={item.shadow ?? pal.shadow}
                                    width={cardW}
                                />
                            );
                        })}
                    </View>
                )}

                {showFooter && (
                    <View style={styles.foot}>
                        <Text style={styles.footText}>Celifrut · Sistema de operaciones</Text>
                        <View style={styles.footDot} />
                        <Text style={styles.footVer}>V-{DeviceInfo.getVersion()}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, width: '100%', backgroundColor: celifrut.cream },
    scrollContent: { alignItems: 'center', paddingTop: 24, paddingBottom: 48 },
    page: { width: '100%', maxWidth: 1180 },

    head: { marginBottom: 24 },
    eyebrow: {
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 1.76,
        color: celifrut.greenDark,
        marginBottom: 6,
    },
    title: { fontWeight: '800', fontSize: 32, color: celifrut.brown, lineHeight: 38 },
    sub: { marginTop: 8, fontSize: 15, color: celifrut.fg3 },

    grid: { flexDirection: 'row', flexWrap: 'wrap' },

    mod: {
        position: 'relative',
        overflow: 'hidden',
        minHeight: 152,
        backgroundColor: celifrut.paper,
        borderWidth: 1,
        borderColor: celifrut.borderSoft,
        borderRadius: 22,
        paddingVertical: 20,
        paddingRight: 20,
        paddingLeft: 22,
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#4E2810',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    modPressed: {
        transform: [{ translateY: -3 }],
        borderColor: celifrut.borderMedium,
        elevation: 8,
        shadowOpacity: 0.14,
        shadowRadius: 16,
    },
    accentStrip: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
    modTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    modIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
    },
    chevPressed: { transform: [{ translateX: 3 }] },
    modBody: { marginTop: 14, gap: 4 },
    modTitle: { fontWeight: '800', fontSize: 19, color: celifrut.brown, lineHeight: 22 },
    modDesc: { fontSize: 13, color: celifrut.fg3, lineHeight: 19 },

    empty: {
        alignItems: 'center',
        paddingVertical: 56,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: celifrut.borderStrong,
        borderStyle: 'dashed',
        borderRadius: 22,
        backgroundColor: celifrut.sand50,
    },
    emptyText: { color: celifrut.fg3, fontSize: 14, textAlign: 'center', lineHeight: 20 },

    foot: { marginTop: 32, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    footText: { fontSize: 12, color: celifrut.fg4 },
    footDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: celifrut.borderStrong },
    footVer: { fontSize: 12, color: celifrut.fg4, fontFamily: 'monospace', letterSpacing: 0.4 },
});
