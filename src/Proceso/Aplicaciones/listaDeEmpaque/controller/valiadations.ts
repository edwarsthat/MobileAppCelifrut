/* eslint-disable prettier/prettier */
import { contenedoresType } from "../../../../../types/contenedoresType";
import { predioType } from "../../../../../types/predioType";

export const validarActualizarPallet = (cajas: number, loteActual: predioType, pallet: number, contenedor: contenedoresType) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (pallet === -1) { throw new Error('Pallet no permitido'); }
    const cajasActual = cajas - Number(contenedor?.pallets[pallet].EF1.reduce((acu, item) => (acu += item.cajas), 0));
    if (cajasActual < 1) { throw new Error('Error en el numero de cajas'); }
    if (
        contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
        contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
    ) {
        throw new Error('El contenedor tiene un tipo de fruta diferente');
    }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calibre === 0) { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calidad === 0) { throw new Error('Error configure el pallet'); }
    return cajasActual;
};
export const validarSumarDato = (cajas: number, loteActual: predioType, pallet: number, contenedor: contenedoresType) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (pallet === -1) { throw new Error('Pallet no permitido'); }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calibre === 0) { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calidad === 0) { throw new Error('Error configure el pallet'); }
};
export const validarEliminar = (cajas: number, loteActual: predioType, seleccion: number[]) => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
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
    numeroContenedor: number,
    contenedorID: number,
    entradaModalPallet: string,
    contenedor: contenedoresType,
    contenedor2: contenedoresType | number
) => {
    if (numeroContenedor === -1) { throw new Error('Seleccione un contenedor'); }
    if (contenedorID !== -1) {
      if (entradaModalPallet === '') { throw new Error('Ingrese el pallet al que desea mover las cajas'); }
    }
    if(typeof contenedor2 === "object"){
        if (
            contenedor2 &&
            contenedor2.pallets &&
          Number(entradaModalPallet) > contenedor2.pallets.length
        ) {
          throw new Error('Error en el pallet');
        }
    }

};
