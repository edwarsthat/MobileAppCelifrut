import { useState } from "react";
import { ZodSchema, ZodError } from "zod";

type HandleFieldChange<T> = <K extends keyof T>(field: K, value: T[K]) => void;
type OutType<T> = {
    formState: T
    formErrors: Partial<Record<keyof T | string, string>>
    handleFieldChange: HandleFieldChange<T>
    handleArrayChange: (e: { target: { name: string; value: string[] } }) => void
    resetForm: () => void
    fillForm: (formData: T) => void
    validateForm: (schema: ZodSchema<unknown>) => boolean
    setFormState: (e: T) => void
}

export default function useForm<T extends Record<string, any>>(initialState?: T): OutType<T> & { handleFieldChange: HandleFieldChange<T> } {

    const [formState, setFormState] = useState<T>(initialState ?? ({} as T));
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof T | string, string>>>({});

    const resetForm = (): void => {
        setFormState(initialState ?? {} as T);
    };

    const fillForm = (formData: T): void => {
        setFormState(formData);
    };

    const handleFieldChange: HandleFieldChange<T> = (field, value) => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Función de cambio para campos array
    const handleArrayChange = (e: { target: { name: string; value: string[] } }): void => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const getErrorMessages = (zodError: ZodError): Partial<Record<keyof T | string, string>> => {
        const errors: Partial<Record<keyof T | string, string>> = {};
        zodError.errors.forEach(err => {
            const path = err.path[0] as keyof T;
            errors[path] = err.message;
        });
        return errors;
    };

    const validateForm = (schema: ZodSchema<unknown>): boolean => {
        const result = schema.safeParse(formState);
        if (!result.success) {
            const errorMap = getErrorMessages(result.error);
            setFormErrors(errorMap);
            return false;
        }
        setFormErrors({});
        return true;
    };


    return {
        formState,
        formErrors,
        handleFieldChange,
        resetForm,
        fillForm,
        validateForm,
        setFormState,
        handleArrayChange,
    };
}
