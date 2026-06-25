import React from 'react';
import { CargoType } from '../../types/cargosType';
import MenuGrid, { MenuItem } from './components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function ProcesoMenu(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Proceso ? Object.keys(props.permisos.Proceso) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Aplicaciones')) {
        items.push({ key: 'aplicaciones', label: 'Aplicaciones', desc: 'Registro de aplicaciones en planta.', lib: 'feather', icon: 'play', onPress: () => props.seleccionWindow('Proceso/Aplicaciones') });
    }
    if (permKeys.includes('Historiales Aplicaciones')) {
        items.push({ key: 'historiales', label: 'Historiales Aplicaciones', desc: 'Consulta el histórico de aplicaciones.', lib: 'feather', icon: 'clock', onPress: () => props.seleccionWindow('Proceso/historiales_aplicaciones') });
    }

    return (
        <MenuGrid eyebrow="PROCESO" title="Proceso" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
