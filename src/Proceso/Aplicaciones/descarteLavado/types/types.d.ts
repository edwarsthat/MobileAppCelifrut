/* eslint-disable prettier/prettier */
export type datosPredioType = {
    _id: string
    enf: string;
    nombrePredio: string;
    tipoFruta: 'Naranja' | 'Limon' | '';
};

export type FormCategory = {
    canastillas: number;
    kilos: number;
};

export type FormState = {
    descarteGeneral: FormCategory;
    pareja: FormCategory;
    balin: FormCategory;
    descompuesta: FormCategory;
    piel: FormCategory;
    hojas: FormCategory;
};
