/* eslint-disable prettier/prettier */

import { useContext } from "react";
import { envContext } from "../../App";


type EnvContextType = {
    url: string,
    socketURL: string
}

export default function useEnvContext(): EnvContextType {
    const {url, socketURL} = useContext(envContext);
    if (!url) {
        throw new Error("Error en env context");
    }
    if (!socketURL) {
        throw new Error("Error en env context");
    }
    return {url, socketURL};
}
