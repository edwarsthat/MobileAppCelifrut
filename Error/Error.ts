/* eslint-disable prettier/prettier */

export class CustomError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        // Es necesario esto para mantener la traza de la pila de errores correcta en V8 (Chrome)
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
