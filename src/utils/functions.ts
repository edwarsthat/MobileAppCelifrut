import { contenedoresType } from "../../types/contenedores/contenedoresType";
import { calidadesType } from "../../types/tiposFrutas";

// export const calidadData = (tipoFruta: tiposFrutasType[], id: string): calidadesType | undefined => {
//     return tipoFruta
//         .flatMap(tf => tf.calidades)
//         .find(cal => cal._id === id);
// };

export const getCalidadesFrutas = (contenedor: contenedoresType | null, tipoFrutas: calidadesType[]): calidadesType[] => {
    if (!contenedor) {
        return [];
    }
    const calidadIds = contenedor.infoContenedor.calidad.map(cal => cal._id);
    const dataCalidad = tipoFrutas.filter(cal => calidadIds.includes(cal._id));
    return dataCalidad;
};
