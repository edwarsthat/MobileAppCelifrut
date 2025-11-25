import { z } from 'zod';

export const formInit = {
    descarte: "",
    canastillas: "",
    kilos: ""
}

export type formType = typeof formInit;

export type datosPredioType = {
    _id: string;
    enf: string;
    tipoFruta: string;
    nombrePredio: string;
};

export const schemaForm = z.object({
    descarte: z.string().min(1, "Seleccione un descarte"),
    canastillas: z.string().refine((val) => {
        if (val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
    }, "Las canastillas deben ser un número mayor o igual a 0").optional().or(z.literal("")),
    kilos: z.string().refine((val) => {
        if (val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
    }, "Los kilos deben ser un número mayor o igual a 0").optional().or(z.literal("")),
}).refine((data) => {
    return data.canastillas !== "" || data.kilos !== "";
}, {
    message: "Debe ingresar al menos canastillas o kilos",
    path: ["canastillas"],
})

export type SchemaFormType = z.infer<typeof schemaForm>;
