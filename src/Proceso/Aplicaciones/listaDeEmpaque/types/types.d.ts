/* eslint-disable prettier/prettier */
export type cajasSinPalletType = {
    lote: {
        _id: string
        enf: string
        predio: string
    }
    cajas: number
    tipoCaja: string
    calibre: number
    calidad: number
    fecha: string
}

export type settingsType = {
    tipoCaja: string
    calidad: string
    calibre: string
}


export type itemType =  {
    lote: string
    cajas: number;
    tipoCaja: string | undefined;
    calibre: string | undefined;
    calidad: string | undefined;
    tipoFruta: string;
    fecha: Date;
}
