import { z } from "zod";


export const formInit: FormState = {
    descarteGeneral: {
        canastillas: 0,
        kilos: 0,
    },
    pareja: {
        canastillas: 0,
        kilos: 0,
    },
    balin: {
        canastillas: 0,
        kilos: 0,
    },
    descompuesta: {
        canastillas: 0,
        kilos: 0,
    },
    extra: {
        canastillas: 0,
        kilos: 0,
    },
    suelo: {
        canastillas: 0,
        kilos: 0,
    },
    frutaNacional: {
        canastillas: 0,
        kilos: 0,
    },
};

export type FormCategory = {
    canastillas: number;
    kilos: number;
};

export type FormState = {
    descarteGeneral: FormCategory;
    pareja: FormCategory;
    balin: FormCategory;
    descompuesta: FormCategory;
    extra: FormCategory;
    suelo: FormCategory;
    frutaNacional: FormCategory;
};

export const labelsForm = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    extra: 'Extra',
    suelo: 'Fruta caida',
    frutaNacional: 'Fruta Nacional',
};

export const formSchema = z.object({
    descarteGeneral: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    pareja: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    balin: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    descompuesta: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    extra: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    suelo: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    frutaNacional: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
});

