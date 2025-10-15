import { lotesType } from "../lotesType";
import { calidadesType } from "../tiposFrutas";
import { contenedoresType } from "./contenedoresType";
import { palletsType } from "./palletsType";

export type itemPalletType = {
    _id: string;
    pallet: palletsType;
    contenedor: contenedoresType;
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
