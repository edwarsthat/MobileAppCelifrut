
export interface LoteInfo {
    enf: string;
    predio: string;
    _id: string;
    ICA: Record<string, unknown>;
    GGN: Record<string, unknown>;
    predioID: string;
    SISPAP: boolean;
}

export interface EF1Item {
    lote: LoteInfo;
    cajas: number;
    tipoCaja: string;
    calibre: string;
    calidad: string;
    fecha: Date;
    tipoFruta: string;
    SISPAP: boolean;
    GGN: boolean;
    _id: string;
    contenedor: number;
    pallet: number;
}
