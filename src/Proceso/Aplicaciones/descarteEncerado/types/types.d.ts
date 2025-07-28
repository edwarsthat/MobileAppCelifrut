export type datosPredioType = {
    _id: string
    enf: string;
    nombrePredio: string;
    tipoFruta: string;
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
    extra: FormCategory;
    suelo: FormCategory;
    frutaNacional: FormCategory;
};
