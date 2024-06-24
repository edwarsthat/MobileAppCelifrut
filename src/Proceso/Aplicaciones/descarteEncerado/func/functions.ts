/* eslint-disable prettier/prettier */
import { FormState, datosPredioType } from "../types/types";

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
    extra: {
        canastillas: 0,
        kilos: 0,
    },
    suelo: {
        canastillas: 0,
        kilos: 0,
    },
    frutaNacional: {
        canastillas: 0,
        kilos: 0,
    },
};

export const labels = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    extra: 'Extra',
    suelo: 'Fruta caida',
    descompuesta: 'Descompuesta',
    frutaNacional: 'Fruta Nacional',
};

const datosSalida = {
    descarteGeneral:0,
    pareja:0,
    balin:0,
    descompuesta:0,
    extra:0,
    suelo:0,
    frutaNacional:0,
};

export const sumarDatos = (datos: FormState, lote: datosPredioType) => {
    let mult;
    switch (lote.tipoFruta) {
        case 'Naranja':
            mult = 19;
            break;
        case 'Limon':
            mult = 20;
            break;
    }
    Object.keys(datosSalida).map(item => {
        datosSalida[item] = (Number(datos[item ].canastillas) * mult) + Number(datos[item].kilos);
    });
    return datosSalida;
};
