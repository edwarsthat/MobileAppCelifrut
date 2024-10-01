/* eslint-disable prettier/prettier */

import { useContext } from "react";
import { envContext } from "../../App";


type EnvContextType = {
    url: string
}

export default function useEnvContext(): EnvContextType {
    const env = useContext(envContext);
    if (!env) {
        throw new Error("Error en env context");
    }
    return env;
}
