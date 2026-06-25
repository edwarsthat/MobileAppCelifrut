import React from 'react';
import { CargoType } from '../../types/cargosType';
import MenuGrid, { MenuItem } from './components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Comercial(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Comercial ? Object.keys(props.permisos.Comercial) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Proveedores')) {
        items.push({ key: 'proveedores', label: 'Proveedores', desc: 'Gestión de proveedores de fruta.', lib: 'mci', icon: 'storefront-outline', onPress: () => props.seleccionWindow('Comercial/Proveedores') });
    }

    return (
        <MenuGrid eyebrow="COMERCIAL" title="Comercial" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
