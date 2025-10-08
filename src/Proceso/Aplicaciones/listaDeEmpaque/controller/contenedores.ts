import { contenedoresType } from "../../../../../types/contenedores/contenedoresType";

export function obtenerItem(contenedor:contenedoresType, _idItem:string){
    for (const pallet of contenedor.pallets) {
        for (const item of pallet.EF1) {
            if (item._id === _idItem) {
                return item;
            }
        }
    }
}
