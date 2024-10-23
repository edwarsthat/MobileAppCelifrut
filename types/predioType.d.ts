/* eslint-disable prettier/prettier */
export type predioType = {
    _id: string,
    enf: string,
    nombrePredio: string,
    predio: string,
    tipoFruta: string
};


interface ResponseItem {
    documento: {
        _id: string;
        enf: string;
        predio: {
            _id: string;
            PREDIO: string;
        };
        tipoFruta: string;
    };
}
