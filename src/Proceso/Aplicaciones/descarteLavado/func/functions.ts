import { FormState, datosPredioType } from '../types/types';

export const formInit: FormState = {
    descarteGeneral: {
        canastillas: 0,
        kilos: 0,
    },
    pareja: {
        canastillas: 0,
        kilos: 0,
    },
    balin: {
        canastillas: 0,
        kilos: 0,
    },
    descompuesta: {
        canastillas: 0,
        kilos: 0,
    },
    piel: {
        canastillas: 0,
        kilos: 0,
    },
    hojas: {
        canastillas: 0,
        kilos: 0,
    },
};

export const labels = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    piel: 'Desprendimiento de piel',
    hojas: 'Hojas',
};

const datosSalida: { [key: string]: number }  = {
    descarteGeneral:0,
    pareja:0,
    balin:0,
    descompuesta:0,
    piel:0,
    hojas:0,
};

export const sumarDatos = (datos: FormState, lote: datosPredioType) => {
    let mult: number;
    switch (lote.tipoFruta) {
        case 'Naranja':
            mult = 19;
            break;
        case 'Limon':
            mult = 20;
            break;
    }
    Object.keys(datosSalida).forEach(item => {
        const key = item as keyof FormState;
        datosSalida[item] = (Number(datos[key].canastillas) * mult) + Number(datos[key].kilos);
    });
    return datosSalida;
};
