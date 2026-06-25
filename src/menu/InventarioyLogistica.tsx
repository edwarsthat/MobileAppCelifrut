import React from 'react';
import { CargoType } from '../../types/cargosType';
import MenuGrid, { MenuItem } from './components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function InventarioyLogistica(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.['Inventario y Logística'] ? Object.keys(props.permisos['Inventario y Logística']) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Inventarios')) {
        items.push({ key: 'inventarios', label: 'Inventarios', desc: 'Existencias y movimientos de fruta.', lib: 'feather', icon: 'box', onPress: () => props.seleccionWindow('Inventario y Logística/inventarios') });
    }

    return (
        <MenuGrid eyebrow="INVENTARIO Y LOGÍSTICA" title="Inventario y Logística" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
