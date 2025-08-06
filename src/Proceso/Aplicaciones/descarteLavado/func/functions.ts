import { tiposFrutasType } from '../../../../../types/tiposFrutas';
import { datosPredioType } from '../types/types';
import { FormState } from '../validations/validations';

export const labels = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    piel: 'Desprendimiento de piel',
    hojas: 'Hojas',
};

export const sumarDatos = (datos: FormState, lote: datosPredioType, tipoFrutas: tiposFrutasType[]): Record<string, number> => {
    let mult;
    const tipoFruta = tipoFrutas.find(item => item._id === lote.tipoFruta);
    if (tipoFruta) {
        mult = tipoFruta.valorPromedio;
    } else {
        mult = 1;
    }
    const salida: Record<string, number> = {
        descarteGeneral: 0,
        pareja: 0,
        balin: 0,
        descompuesta: 0,
        piel: 0,
        hojas: 0,
    };
    Object.keys(datos).forEach(item => {
        salida[item] = (Number(datos[item as keyof FormState].canastillas) * mult) + Number(datos[item as keyof FormState].kilos);
    });
    return salida;
};
