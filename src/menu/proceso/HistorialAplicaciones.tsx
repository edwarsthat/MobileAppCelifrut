import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function HistorialAplicaciones(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Proceso?.['Historiales Aplicaciones']
        ? Object.keys(props.permisos.Proceso['Historiales Aplicaciones'])
        : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Descarte lavado')) {
        items.push({ key: 'lavado', label: 'Descarte Lavado', desc: 'Histórico de descarte en lavado.', lib: 'mci', icon: 'water', onPress: () => props.seleccionWindow('66b6708677549ed0672a902a') });
    }
    if (permKeys.includes('Descarte Encerado')) {
        items.push({ key: 'encerado', label: 'Descarte Encerado', desc: 'Histórico de descarte en encerado.', lib: 'mci', icon: 'spray', onPress: () => props.seleccionWindow('66b6708f77549ed0672a902b') });
    }
    if (permKeys.includes('Fotos calidad')) {
        items.push({ key: 'fotos', label: 'Fotos Calidad', desc: 'Histórico de fotos de calidad.', lib: 'feather', icon: 'camera', onPress: () => props.seleccionWindow('66b6709877549ed0672a902c') });
    }

    return (
        <MenuGrid eyebrow="PROCESO · HISTORIALES" title="Historiales Aplicaciones" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
