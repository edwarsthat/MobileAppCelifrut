import { z } from 'zod';

export const formInit = {
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
    piel: {
        canastillas: 0,
        kilos: 0,
    },
    hojas: {
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
    piel: FormCategory;
    hojas: FormCategory;
};

export const labelsForm = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    piel: 'Desprendimiento de piel',
    hojas: 'Hojas',
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
    piel: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
    hojas: z.object({
        canastillas: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo canastillas es requerido' }),
        kilos: z.number({ invalid_type_error: 'Ingrese un número válido', required_error: 'El campo kilos es requerido' }),
    }),
});
