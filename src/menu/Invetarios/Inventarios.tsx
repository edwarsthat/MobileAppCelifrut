import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Inventarios(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.['Inventario y Logística']?.Inventarios
        ? Object.keys(props.permisos['Inventario y Logística'].Inventarios)
        : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Fruta sin procesar')) {
        items.push({ key: 'fruta_sin_procesar', label: 'Fruta sin procesar', desc: 'Inventario de fruta sin procesar.', lib: 'feather', icon: 'box', onPress: () => props.seleccionWindow('66b66e8d77549ed0672a9015') });
    }
    if (permKeys.includes('Orden de vaceo')) {
        items.push({ key: 'orden_vaceo', label: 'Orden de vaceo', desc: 'Gestión de órdenes de vaceo.', lib: 'feather', icon: 'truck', onPress: () => props.seleccionWindow('66b66ece77549ed0672a9018') });
    }
    if (permKeys.includes('Inventario Cuartos Fríos')) {
        items.push({ key: 'cuartos_frios', label: 'Inventario Cuartos Fríos', desc: 'Existencias en cuartos fríos.', lib: 'mci', icon: 'snowflake', onPress: () => props.seleccionWindow('68c86c1799dddf63af97548e') });
    }

    return (
        <MenuGrid eyebrow="INVENTARIO · INVENTARIOS" title="Inventarios" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
