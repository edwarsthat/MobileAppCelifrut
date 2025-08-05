import { contenedoresType } from "../../../../../types/contenedoresType";


export const obtenerResumen = (
    cont: contenedoresType[],
    soloHoy: boolean)
    : {
        kilos_por_calibre: object,
        kilos_por_calidad: object,
        cajas_por_calibre: object,
        cajas_por_calidad: object,
        kilo_total: number,
        total_cajas: number
    } | null => {

    if (cont === undefined) {return null;}

    const calibre: { [key: string]: number } = {};
    const calibreCajas: { [key: string]: number } = {};

    const calidad: { [key: string]: number } = {};
    const cajasCalidad: { [key: string]: number } = {};

    let sumaKilos = 0;
    let total_cajas = 0;


    cont.forEach(contenedor => {
        contenedor.pallets.forEach(pallet => {
            pallet.EF1.forEach(item => {
                //se crea el elemento en el objeto
                if (!Object.prototype.hasOwnProperty.call(calibre, item.calibre)) {
                    calibre[item.calibre] = 0;
                    calibreCajas[item.calibre] = 0;
                }
                if (!Object.prototype.hasOwnProperty.call(calidad, item.calidad)) {
                    calidad[item.calidad] = 0;
                    cajasCalidad[item.calidad] = 0;
                }
                //se obtiene el peso de la caja
                const kilosToMult = Number(item.tipoCaja.split("-")[1]);
                //si si hay peso
                if (kilosToMult) {
                    //lo kilos total
                    const kilos = item.cajas * kilosToMult;
                    //if si mira si solo se requieren los datos de hoy
                    if (!soloHoy) {
                        calibre[item.calibre] += kilos;
                        calibreCajas[item.calibre] += item.cajas;
                        calidad[item.calidad] += kilos;
                        cajasCalidad[item.calidad] += item.cajas;
                        sumaKilos += kilos;
                        total_cajas += item.cajas;
                    } else {
                        const hoy = new Date().getDate();
                        const fechaItem = new Date(item.fecha).getDate();
                        if (hoy === fechaItem) {
                            calibre[item.calibre] += kilos;
                            calibreCajas[item.calibre] += item.cajas;
                            calidad[item.calidad] += kilos;
                            cajasCalidad[item.calidad] += item.cajas;
                            sumaKilos += kilos;
                            total_cajas += item.cajas;

                        } else {
                            calibre[item.calibre] += 0;
                            calibreCajas[item.calibre] += 0;
                            calidad[item.calidad] += 0;
                            cajasCalidad[item.calidad] += 0;
                            sumaKilos += 0;
                            total_cajas += 0;

                        }
                    }
                } else {
                    calibreCajas[item.calibre] += 0;
                    calibre[item.calibre] += 0;
                    calidad[item.calidad] += 0;
                    cajasCalidad[item.calidad] += 0;
                    sumaKilos += 0;
                    total_cajas += 0;

                }
            });
        });
    });
    return {
        kilos_por_calibre: calibre,
        kilos_por_calidad: calidad,
        cajas_por_calibre: calibreCajas,
        cajas_por_calidad: cajasCalidad,
        kilo_total: sumaKilos,
        total_cajas: total_cajas,
    };
};
