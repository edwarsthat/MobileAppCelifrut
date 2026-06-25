import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function IngresosCalidad(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Calidad?.['Ingresos Calidad']
        ? Object.keys(props.permisos.Calidad['Ingresos Calidad'])
        : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Ingreso Clasificacion descarte')) {
        items.push({ key: 'clasificacion', label: 'Clasificación descarte', desc: 'Ingreso de clasificación de descarte.', lib: 'feather', icon: 'filter', onPress: () => props.seleccionWindow('66b6701177549ed0672a9022') });
    }
    if (permKeys.includes('Higiene personal')) {
        items.push({ key: 'higiene', label: 'Higiene personal', desc: 'Ingreso de higiene personal.', lib: 'feather', icon: 'user-check', onPress: () => props.seleccionWindow('66c5130bb51eef12da89050e') });
    }

    return (
        <MenuGrid eyebrow="CALIDAD · INGRESOS" title="Ingresos Calidad" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
