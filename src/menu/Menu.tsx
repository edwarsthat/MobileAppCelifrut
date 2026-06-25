import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CargoType } from '../../types/cargosType';
import { celifrut } from '../theme/celifrutTokens';
import MenuGrid, { MenuItem, IconLib } from './components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

// Presentación de cada módulo (icono/descripción). La navegación usa la MISMA
// clave de permiso de antes con props.seleccionWindow(key). 'navigate:false'
// conserva que "Sistema" no tenía handler.
type ModDef = { key: string; desc: string; lib: IconLib; icon: string; navigate: boolean };

const MODULES: ModDef[] = [
    { key: 'Inventario y Logística', desc: 'Stock, despachos y movimientos de fruta.', lib: 'feather', icon: 'box', navigate: true },
    { key: 'Calidad', desc: 'Controles e inspección de producto.', lib: 'mci', icon: 'flask-outline', navigate: true },
    { key: 'Sistema', desc: 'Usuarios, permisos y configuración.', lib: 'feather', icon: 'settings', navigate: false },
    { key: 'Proceso', desc: 'Producción y trazabilidad en planta.', lib: 'feather', icon: 'play', navigate: true },
    { key: 'Comercial', desc: 'Clientes, pedidos y ventas.', lib: 'mci', icon: 'storefront-outline', navigate: true },
];

export default function Menu(props: propsType): React.JSX.Element {
    if (props.permisos === undefined) {
        return (
            <View style={styles.screenCenter}>
                <Text style={styles.muted}>Cargando permisos…</Text>
            </View>
        );
    }

    const permKeys = Object.keys(props.permisos);
    const items: MenuItem[] = MODULES
        .filter((m) => permKeys.includes(m.key))
        .map((m) => ({
            key: m.key,
            label: m.key,
            desc: m.desc,
            lib: m.lib,
            icon: m.icon,
            onPress: m.navigate ? () => props.seleccionWindow(m.key) : undefined,
        }));

    return (
        <MenuGrid
            eyebrow="MENÚ PRINCIPAL"
            title="¿Qué vamos a gestionar hoy?"
            subtitle="Selecciona un módulo para comenzar."
            items={items}
            showFooter
        />
    );
}

const styles = StyleSheet.create({
    screenCenter: { flex: 1, width: '100%', backgroundColor: celifrut.cream, alignItems: 'center', justifyContent: 'center' },
    muted: { color: celifrut.fg3, fontSize: 14 },
});
