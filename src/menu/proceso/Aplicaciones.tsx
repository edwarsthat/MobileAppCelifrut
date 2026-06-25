import React from 'react';
import { CargoType } from '../../../types/cargosType';
import MenuGrid, { MenuItem } from '../components/MenuGrid';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function Aplicaciones(props: propsType): React.JSX.Element {
    const permKeys = props.permisos?.Proceso?.Aplicaciones ? Object.keys(props.permisos.Proceso.Aplicaciones) : [];
    const items: MenuItem[] = [];

    if (permKeys.includes('Descarte Lavado')) {
        items.push({ key: 'lavado', label: 'Descarte Lavado', desc: 'Registro de descarte en lavado.', lib: 'mci', icon: 'water', onPress: () => props.seleccionWindow('66b6706477549ed0672a9027') });
    }
    if (permKeys.includes('Descarte Encerado')) {
        items.push({ key: 'encerado', label: 'Descarte Encerado', desc: 'Registro de descarte en encerado.', lib: 'mci', icon: 'spray', onPress: () => props.seleccionWindow('66b6706e77549ed0672a9028') });
    }
    if (permKeys.includes('Fotos calidad')) {
        items.push({ key: 'fotos', label: 'Fotos Calidad', desc: 'Captura de fotos de calidad.', lib: 'feather', icon: 'camera', onPress: () => props.seleccionWindow('66b6705a77549ed0672a9026') });
    }
    if (permKeys.includes('Lista de empaque')) {
        items.push({ key: 'lista_empaque', label: 'Lista de empaque', desc: 'Gestión de listas de empaque.', lib: 'feather', icon: 'clipboard', onPress: () => props.seleccionWindow('66b6707777549ed0672a9029') });
    }

    return (
        <MenuGrid eyebrow="PROCESO · APLICACIONES" title="Aplicaciones" subtitle="Selecciona una opción para continuar." items={items} />
    );
}
