
export type tiposFrutasType = {
    _id: string
    tipoFruta: string,
    valorPromedio: number,
    defectos: string[],
    rengoDeshidratacionPositiva: number,
    rengoDeshidratacionNegativa: number,
    createdAt: string
    calibres: string[]
}

export type calidadesType = {
    _id: string;
    nombre: string;
    descripcion: string;
    tipoFruta: tiposFrutasType;
}
