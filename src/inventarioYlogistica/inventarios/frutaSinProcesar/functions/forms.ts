/* eslint-disable prettier/prettier */

export type formType = {
    canastillas: string
    placa:string
    nombreConductor: string
    telefono: string
    cedula:string
    remision:string
}


export const forminit: formType = {
    canastillas:'',
    placa:'',
    nombreConductor:'',
    telefono: '',
    cedula:'',
    remision:'',
};

export const labels = {
    canastillas:'Canastillas',
    placa:'Placa',
    nombreConductor:'Nombre del conductor',
    telefono: 'Telefono',
    cedula:'Cedula',
    remision:'Remisión',
};
