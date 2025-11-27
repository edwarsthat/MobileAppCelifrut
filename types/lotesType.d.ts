
import { clientesNacionalesType, clienteType } from "./clientesType";
import { contenedoresType } from "./contenedoresType";
import { userType } from "./cuentas";
import { precioProveedorType } from "./preciosTypes";
import { proveedoresType } from "./proveedoresType";
import { calidadesType, tiposFrutasType } from "./tiposFrutas";

/* eslint-disable @typescript-eslint/ban-types */
export type lotesType = {
    __v?: number;
    _id: string;
    aprobacionComercial: boolean;
    aprobacionProduccion: boolean;
    calidad?: calidadType;
    canastillas: string;
    canastillas_estimadas: number,
    contenedores?: string[];
    descarteLavado?: descarteLavadoType;
    descarteEncerado?: descarteEnceradoType;
    deshidratacion: number;
    desverdizado?: desverdizadoType;
    dias_inicio_fin?: number;
    directoNacional: number;
    enf: string;
    fecha_creacion: string,
    fechaIngreso: string,
    fecha_ingreso_patio: string,
    fecha_salida_patio: string,
    fecha_ingreso_inventario: string,
    fecha_estimada_llegada: string
    fecha_aprobacion_comercial: string,
    fechaProceso: string;
    fecha_finalizado_proceso: string;
    flag_is_favorita: boolean;
    flag_balin_free: boolean;
    frutaNacional?: number;
    GGN?: boolean;
    informeEnviado?: boolean;
    inventario?: number;
    inventarioDesverdizado?: number;
    infoSalidaDirectoNacional?: directoNacionalType
    kilos: number;
    kilos_estimados: number;
    kilosReprocesados: number;
    kilosVaciados: number;
    kilosProcesados: number;
    numeroPrecintos: number;
    numeroRemision: string;
    not_pass?: boolean;
    observaciones: string;
    placa: string;
    precio: precioProveedorType,
    predio: proveedoresType;
    promedio: number;
    rendimiento: number;
    salidaExportacion: salidaExportacionType;
    tipoFruta: tiposFrutasType;
    urlBascula?: string;
    urlInformeCalidad?: string;
    user: userType
};
interface salidaExportacionType {
    kilosGGN: number;
    totalKilos: number;
    totalCajas: number;
    porCalidad: { [calidadId: string]: { kilos: number; cajas: number } };
    porCalibre: { [calibre: string]: { kilos: number; cajas: number } };
    contenedores: contenedoresType[];
}
interface directoNacionalType {
    placa: string,
    nombreConductor: string,
    telefono: string,
    cedula: string,
    remision: string,
    canastillas: number,
    user: string,
    cliente: clientesNacionalesType,
    fecha: string,
}
export type historialLotesType = {
    documento: lotesType;
    user?: string;
    fecha: string;
    _id: string;
    operacionRealizada: string;
    __v: number;
};
type descarteLavadoType = {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    descompuesta: number;
    piel: number;
    hojas: number;
};
type descarteEnceradoType = {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    extra: number;
    descompuesta: number;
    suelo: number;
};
type inventarioActualType = {
    descarteEncerado?: {
        descarteGeneral: number;
        pareja: number;
        balin: number;
        extra: number;
        suelo: number;
    };
    descarteLavado?: {
        descarteGeneral: number;
        pareja: number;
        balin: number;
    };
};
type calidadType = {
    inspeccionIngreso?: {
        fechaIngreso: string
        [key: string]: string
    }
    calidadInterna?: {
        acidez: number;
        brix: number;
        ratio: number;
        peso: number;
        zumo: number;
        fecha: string;
        semillas: boolean;
        user: string;
        calidad: calidadesType;
    };
    clasificacionCalidad?: {
        acaro: number;
        alsinoe: number;
        dannosMecanicos: number;
        division: number;
        escama: number;
        frutaMadura: number;
        frutaVerde: number;
        fumagina: number;
        grillo: number;
        herbicida: number;
        melanosis: number;
        oleocelosis: number;
        piel: number;
        trips: number;
        nutrientes: number;
        antracnosis: number;
        frutaRajada: number;
        ombligona: number;
        despezonada: number;
        variegacion: number;
        verdeManzna: number;
        otrasPlagas: number;
        sombra: number,
        wood: number,
        fecha: string;
    };
    fotosCalidad?: {
        fechaIngreso: string
        [key: string]: string
    };
};
type desverdizadoType = {
    canastillasIngreso: number;
    kilosIngreso: number;
    cuartoDesverdizado: string;
    fechaIngreso: string;
    fechaFinalizar: string;
    _id?: string;
    parametros: parametrosDesverdizadoType[];
};
type parametrosDesverdizadoType = {
    fecha: string;
    temperatura: number;
    etileno: number;
    carbono: number;
    humedad: number;
};
export type datosPredioType = {
    _id: string
    enf: string;
    nombrePredio: string;
    tipoFruta: string;
};

export interface loteEF10Type extends lotesType {
    cliente: clienteType;
}