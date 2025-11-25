import { userType } from "./cuentas";
import { lotesType } from "./lotesType";
import { predioType } from "./predioType";
import { tiposFrutasType } from "./tiposFrutas";

export type frutaProcesadaType = {
    loteId: lotesType;
    loteType: 'Lote' | 'loteMaquila';
    fechaProcesamiento: string;
    tipoFruta: tiposFrutasType;
    predio: predioType;
    promedio: number;
    canastillas: number;
    detalles: Record<string, any>;
    createdAt: string;
    user: userType;
}
