
export type tiposFrutasType = {
    _id: string
    tipoFruta: string,
    valorPromedio: number,
    defectos: string[],
    rengoDeshidratacionPositiva: number,
    rengoDeshidratacionNegativa: number,
    createdAt: string
    calibres: string[]
    codNacional: string
    codExportacion: string
    descartes: descartesType[]
    descartesGenerales: [{
        nombre: string,
        key: string
    }]
}

export type calidadesType = {
    _id: string;
    nombre: string;
    descripcion: string;
    importancia: number;
    codContabilidad: string;
    tipoFruta: tiposFrutasType;
}

export type descartesType = {
    _id: string,
    nombre: string,
    descripcion: string,
    seccion: string[],
}