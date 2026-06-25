import React from 'react';
import { CargoType } from '../../types/cargosType';
import MenuGrid, { MenuItem } from './components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Calidad(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Calidad ? Object.keys(props.permisos.Calidad) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Ingresos Calidad')) {
        items.push({ key: 'ingresos_calidad', label: 'Ingresos Calidad', desc: 'Registra ingresos de control de calidad.', lib: 'mci', icon: 'flask-outline', onPress: () => props.seleccionWindow('Calidad/ingresos_calidad') });
    }

    return (
        <MenuGrid eyebrow="CALIDAD" title="Calidad" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
