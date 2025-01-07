import { lotesType } from "../../../../../types/lotesType";

export function sumatoriasInventario(data:lotesType[]){
    let total = 0;
    let naranja = 0;
    let limon = 0;

    const len = data.length;

    for(let i = 0; i < len; i++){
        total += (data[i].inventario ?? 0 ) * (data[i].promedio ?? 0);
        if(data[i].tipoFruta === 'Limon'){
            limon += (data[i].inventario ?? 0)  * (data[i].promedio ?? 0);
        } else if(data[i].tipoFruta === 'Naranja'){
            naranja += (data[i].inventario ?? 0)  * (data[i].promedio ?? 0);
        }
    }

    return [total, naranja, limon];
}
