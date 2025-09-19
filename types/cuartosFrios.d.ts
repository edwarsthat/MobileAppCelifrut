export interface CuartoFrioType {
    _id: string;
    inventario: string[];
    nombre: string;
    totalFruta: {
        [key:string]:{
            cajas:number
            kilos:number
        }
    }
}
