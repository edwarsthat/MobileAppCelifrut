export const INITIAL_CONFIG_PALLET = {
    tipoCaja: '',
    calidad: '',
    calibre: '',
    rotulado: false,
    paletizado: false,
    enzunchado: false,
    estadoCajas: false,
    estiba: false,
    cuartoFrio: '',
};

export const CONTENEDOR_VACIO = {
    _id: '',
    numeroContenedor: 0,
    pallets: [],
    infoContenedor: {
        clienteInfo: { CLIENTE: '', _id: '' },
        tipoFruta: 'Limon',
        cerrado: false,
        desverdizado: false,
        calibres: [],
        calidad: [],
        tipoCaja: [],
    },
};

