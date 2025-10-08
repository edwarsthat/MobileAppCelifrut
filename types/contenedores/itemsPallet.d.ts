import { lotesType } from "../lotesType";
import { calidadesType } from "../tiposFrutas";

export type itemPalletType = {
    _id: string;
    pallet: string;
    contenedor: string;
    lote: lotesType;
    tipoCaja: string;
    calibre: string;
    calidad: calidadesType;
    fecha: string;
    tipoFruta: string;
    SISPAP: boolean;
    GGN: boolean;
    kilos: number;
    user: string;
    cajas: number;
    __v: number;
}
