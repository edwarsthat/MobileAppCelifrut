import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Proveedores(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Comercial?.Proveedores ? Object.keys(props.permisos.Comercial.Proveedores) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Información Proveedores')) {
        items.push({ key: 'info_proveedores', label: 'Información proveedores', desc: 'Datos y fichas de proveedores.', lib: 'feather', icon: 'info', onPress: () => props.seleccionWindow('66b670ca77549ed0672a9030') });
    }

    return (
        <MenuGrid eyebrow="COMERCIAL · PROVEEDORES" title="Proveedores" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
