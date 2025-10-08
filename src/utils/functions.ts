// import { contenedoresType } from "../../types/contenedores/contenedoresType";
// import { tiposFrutasType, calidadesType } from "../../types/tiposFrutas";

// export const calidadData = (tipoFruta: tiposFrutasType[], id: string): calidadesType | undefined => {
//     return tipoFruta
//         .flatMap(tf => tf.calidades)
//         .find(cal => cal._id === id);
// };

export const getCalidadesFrutas = (contenedor: contenedoresType | null, tipoFrutas: tiposFrutasType[]): calidadesType[] => {
    console.log("contenedor", "tipoFrutas");
    // const dataCalidad = contenedor
    //     ? tipoFrutas
    //         .flatMap(tipoFruta => tipoFruta.calidades)
    //         .filter(cal => contenedor.infoContenedor.calidad.includes(cal._id))
    //     : [{ _id: '', descripcion: '', nombre: '' }];
    // return dataCalidad;
};
