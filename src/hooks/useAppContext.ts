import { Dispatch, useContext } from "react";
import { deviceWidth, loadingContext, stackContext } from "../../App";



type EnvContextType = {
    stack: string[]
    setLoading: Dispatch<React.SetStateAction<boolean>>
    anchoDevice: number
}

export function useAppContext(): EnvContextType {
    const stack = useContext(stackContext);
    const setLoading = useContext(loadingContext);
    const anchoDevice = useContext(deviceWidth);

    if (!stack) {
        throw new Error("Error en useAppcontext");
    }

    if (!setLoading) {
        throw new Error("Error en env useAppcontext");
    }
    return { stack, setLoading, anchoDevice };
}
