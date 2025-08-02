import { useContext } from "react";
import { deviceWidth, stackContext } from "../../App";



type EnvContextType = {
    stack: string[]
    anchoDevice: number
}

export function useAppContext(): EnvContextType {
    const stack = useContext(stackContext);
    const anchoDevice = useContext(deviceWidth);

    if (!stack) {
        throw new Error("Error en useAppcontext");
    }

    return { stack, anchoDevice };
}
