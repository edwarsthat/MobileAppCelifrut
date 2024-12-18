import { Dispatch, useContext } from "react";
import { loadingContext, stackContext } from "../../App";



type EnvContextType = {
    stack: string[]
    setLoading: Dispatch<React.SetStateAction<boolean>>
}

export function useAppContext(): EnvContextType {
    const stack = useContext(stackContext);
    const setLoading = useContext(loadingContext);

    if (!stack) {
        throw new Error("Error en useAppcontext");
    }

    if (!setLoading) {
        throw new Error("Error en env useAppcontext");
    }
    return { stack, setLoading };
}
