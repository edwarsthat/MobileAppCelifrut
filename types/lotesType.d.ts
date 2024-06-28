/* eslint-disable prettier/prettier */

import { proveedoresType } from './proveedoresType';


/* eslint-disable @typescript-eslint/ban-types */
export type lotesType = {
    _id: string
    enf: string
    predio:proveedoresType
    canastillas?: string
    tipoFruta?: string
    observaciones?: string
    kilos?: number
    placa?: string
    kilosVaciados?: number
    promedio?: number
    rendimiento?: number
    deshidratacion?: number
    descarteLavado?: descarteLavadoType
    descarteEncerado?: descarteEnceradoType
    directoNacional?: number
    informeEnviado?: boolean
    inventarioActual?: inventarioActualType
    fechaIngreso?: string
    calidad?: calidadType
    frutaNacional?:number
    urlInformeCalidad?: string
    desverdizado?:desverdizadoType
    contenedores?: string[]
    calidad1?: number
    calidad15?: number
    calidad2?: number
    __v?: number
    clasificacionCalidad?: string
    numeroRemision?: string
    numeroPrecintos?: number
    urlBascula?:string
    inventario?:number
    inventarioDesverdizado?:number
}

export type historialLotesType = {
    documento: lotesType
    fecha: string
    _id: string
    operacionRealizada: string

}

type descarteLavadoType = {
    descarteGeneral: number,
    pareja: number,
    balin: number,
    descompuesta: number,
    piel: number,
    hojas: number,
}

type descarteEnceradoType = {
    descarteGeneral: number
    pareja: number
    balin: number
    extra: number
    descompuesta: number
    suelo: number
}

type inventarioActualType = {
    descarteEncerado?: {
        descarteGeneral: number
        pareja: number
        balin: number
        extra: number
        suelo: number
    }
    descarteLavado?: {
        descarteGeneral: number
        pareja: number
        balin: number
    }
}

type calidadType = {
    calidadInterna?:{
        acidez: number
        brix: number
        ratio: number
        peso: number
        zumo: number
        fecha: string
        semillas: boolean
    }
    clasificacionCalidad?: {
        acaro: number
        alsinoe:number
        dannosMecanicos:number
        division:number
        escama:number
        frutaMadura:number
        frutaVerde:number
        fumagina:number
        grillo:number
        herbicida:number
        melanosis:number
        oleocelosis: number
        piel:number
        trips:number
        nutrientes:number
        antracnosis:number
        frutaRajada:number
        ombligona:number
        despezonada:number
        variegacion:number
        verdeManzna:number
        otrasPlagas:number
        fecha: string
    }
    fotosCalidad?: {[key: string]: string}
}

type desverdizadoType = {
    canastillasIngreso?: number
    kilosIngreso?: number
    cuartoDesverdizado?: string
    fechaIngreso?: string
    fechaFinalizar?: string
    _id?: string
    parametros?: parametrosDesverdizadoType[]
}

type parametrosDesverdizadoType = {
    fecha: string
    temperatura: number
    etileno: number
    carbono: number
    humedad: number
}
