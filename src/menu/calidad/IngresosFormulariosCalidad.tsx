import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function IngresosFormulariosCalidad(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Calidad ? Object.keys(props.permisos.Calidad) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Ingresos Formularios')) {
        items.push({ key: 'higiene_personal', label: 'Higiene personal', desc: 'Formulario de higiene personal.', lib: 'feather', icon: 'clipboard', onPress: () => props.seleccionWindow('66c5130bb51eef12da89050e') });
    }

    return (
        <MenuGrid eyebrow="CALIDAD · FORMULARIOS" title="Ingresos Formularios" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
