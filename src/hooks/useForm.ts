import { useState } from "react";
import { ZodSchema, ZodError } from "zod";
import { ZodIssue } from "zod/v3";

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

    const getErrorMessages = <T>(zodError: ZodError): Partial<Record<keyof T | string, string>> => {
        // Quitamos el : ZodIssue, dejamos que TS infiera el tipo automáticamente
        return zodError.issues.reduce((acc, issue) => {
            const path = (issue.path[0] as keyof T | string) ?? 'general';
            acc[path as keyof Partial<Record<keyof T | string, string>>] = issue.message;
            return acc;
        }, {} as Partial<Record<keyof T | string, string>>);
    };

    const validateForm = (schema: ZodSchema<unknown>): boolean => {
        const result = schema.safeParse(formState);
        if (!result.success) {
            // TypeScript ahora reconoce que son idénticos
            setFormErrors(getErrorMessages(result.error));
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
