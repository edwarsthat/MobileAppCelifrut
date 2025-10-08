import { calidadesType } from "../tiposFrutas";

export type palletsType = {
    _id: string;
    numeroPallet: number;
    contenedor: string;
    tipoCaja: string;
    calidad: calidadesType;
    calibre: string;
    rotulado: boolean;
    paletizado: boolean;
    enzunchado: boolean;
    estadoCajas: boolean;
    estiba: boolean;
    finalizado: boolean;
    fechaFinalizado: string;
    estado: 'abierto' | 'cerrado' | 'embarcado';
    __v: number;
}
