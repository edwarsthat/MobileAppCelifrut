import { ZodError } from "zod";

export function getErrorMessages(zodError:ZodError): object {
    const errors: { [key: string]: string }  = {};
    zodError.errors.forEach((err) => {
        const path = err.path[0]; // Solo usamos el primer nivel
        errors[path] = err.message;
    });
    return errors;
}
