
import { z } from "zod";
import { contenedoresType } from "../../../../../types/contenedores/contenedoresType";
import { predioType } from "../../../../../types/predioType";
import { palletsType } from "../../../../../types/contenedores/palletsType";
import { itemPalletType } from "../../../../../types/contenedores/itemsPallet";

export const validarActualizarPallet = (cajas: number, loteActual: predioType, pallet: palletsType, palletItems: itemPalletType[]) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    const cajasActual = cajas - Number(palletItems.reduce((acu, item) => (acu += item.cajas), 0));
    if (cajasActual < 1) { throw new Error('Error en el numero de cajas'); }

    if (pallet.tipoCaja === '') { throw new Error('Error configure el pallet'); }
    if (pallet.calibre === '') { throw new Error('Error configure el pallet'); }
    if (pallet.calidad._id === '') { throw new Error('Error configure el pallet'); }
    return cajasActual;
};
export const validarSumarDato = (cajas: number, loteActual: predioType, pallet: number, pallets: palletsType) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (pallet === -1) { throw new Error('Pallet no permitido'); }
    if (pallets.tipoCaja === '') { throw new Error('Error configure el pallet'); }
    if (pallets.calibre === '') { throw new Error('Error configure el pallet'); }
    if (pallets.calidad._id === '') { throw new Error('Error configure el pallet'); }
};
export const validarEliminar = (cajas: number, seleccion: string[]) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (seleccion.length === 0) { throw new Error('Seleccione el item que desea eliminar'); }
};
export const validarResta = (contenedor: contenedoresType, cajas: number, seleccion: number[], pallet: number) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas === 0) { throw new Error('Ingrese el numero de cajas'); }
    if (seleccion.length === 0) { throw new Error('Seleccione el item al que desea restar cajas'); }
    if (seleccion.length > 1) { throw new Error('Seleccione solo un item'); }
    if (pallet !== -1) {
        const itemCaja = contenedor?.pallets[pallet].EF1[seleccion[0]].cajas;
        if (itemCaja) {
            if (Number(cajas) > itemCaja) {
                throw new Error('Error en el numero de cajas');
            }
        }
    }
};
export const validarMoverItem = (
    cajasModal: number,
    seleccion: number[],
    pallet: number,
    idContendor: string,
    contenedorID: string,
    entradaModalPallet: string,
    contenedor: contenedoresType,
    contenedor2: contenedoresType | string
) => {
    if (idContendor === "") { throw new Error('Seleccione un contenedor'); }
    if (contenedorID !== "") {
        if (entradaModalPallet === '') { throw new Error('Ingrese el pallet al que desea mover las cajas'); }
    }
    if (typeof contenedor2 === "object") {
        if (
            contenedor2 &&
            contenedor2.pallets &&
            Number(entradaModalPallet) > contenedor2.pallets.length
        ) {
            throw new Error('Error en el pallet');
        }
    }
    if (seleccion.length === 1 && pallet !== -1) {
        const validarNcajas =
            contenedor.pallets[pallet].EF1[seleccion[0]].cajas >= cajasModal;
        if (!validarNcajas) {
            throw new Error("Error en el numero de cajas que desea pasar");
        }
    }

};

// Función para validar el request de enviar pallet a cuarto frío
export const validarEnviarCuartoFrioRequest = (): z.ZodSchema => {
    return z.object({
        _id: z.string().min(1, "Seleccione un contenedor"),
        action: z.literal("put_inventarios_pallet_eviarCuartoFrio", {
            errorMap: () => ({ message: "Acción no válida" }),
        }),
        cuartoFrio: z.object({
            _id: z.string().min(1, "Seleccione un cuarto frío"),
            nombre: z.string().min(1, "El cuarto frío debe tener un nombre"),
        }, {
            errorMap: () => ({ message: "Seleccione un cuarto frío válido" }),
        }),
        pallet: z.number({
            required_error: "Escoja un pallet",
            invalid_type_error: "Escoja un pallet válido",
        }).int("Escoja un pallet válido").min(0, "Escoja un pallet válido"),
    });


};

