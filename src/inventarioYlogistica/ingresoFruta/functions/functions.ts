/* eslint-disable prettier/prettier */

interface Descarte {
  balin: number
  pareja: number
  descarteGeneral: number
  descompuesta?: number
  piel?: number
  hojas?: number
  suelo?: number
  extra?: number
}


interface FormState {
  predio: string
  canastillas: string
  kilos: string
  placa: string
  tipoFruta: string
  observaciones: string
  promedio: number
  canastillasVacias: string
  descarteLavado: Descarte
  descarteEncerado: Descarte
  numeroRemision: string
  numeroPrecintos: number
}

export const crear_request_guardar = (formState:formInitType): FormState => {
  return {
    predio: formState.nombrePredio,
    canastillas: formState.canastillas,
    kilos: formState.kilos,
    placa: formState.placa,
    tipoFruta: formState.tipoFruta,
    numeroPrecintos: Number(formState.numeroPrecintos),
    numeroRemision:formState.numeroRemision,
    observaciones: formState.observaciones,
    promedio: parseFloat(formState.kilos) / parseFloat(formState.canastillas),
    canastillasVacias: formState.canastillasVacias,
    descarteLavado: { balin: 0, pareja: 0, descarteGeneral: 0, descompuesta: 0, piel: 0, hojas: 0 },
    descarteEncerado: {
      balin: 0,
      pareja: 0,
      extra: 0,
      descarteGeneral: 0,
      descompuesta: 0,
      suelo: 0,
    },
  };
};


export const formInit: formInitType = {
  nombrePredio: '',
  tipoFruta: '',
  canastillas: '',
  canastillasVacias: '',
  kilos: '',
  placa: '',
  observaciones: '',
  numeroRemision:'',
  numeroPrecintos:'',
};

export const formLabels = {
  nombrePredio: 'Nombre del predio',
  tipoFruta: 'Tipo de fruta',
  numeroRemision:'Numero de Remisión',
  numeroPrecintos:"Numero de precintos",
  canastillas: 'Numero de Canastillas',
  kilos: 'Kilos',
  placa: 'Placa',
  canastillasVacias: 'Canastillas Vacias',
  observaciones: 'Observaciones',
};

export type formInitType = {
  nombrePredio: string,
  tipoFruta: string,
  canastillas: string,
  canastillasVacias: string,
  kilos: string,
  placa: string,
  observaciones: string,
  numeroRemision:string,
  numeroPrecintos: string,
};
