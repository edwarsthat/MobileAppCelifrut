import { Alert } from "react-native";
import { cuartosFriosType } from "../../types/catalogs";
import useEnvContext from "./useEnvContext";
import { useState } from "react";

type outType = {
    cuartosFrios: cuartosFriosType[];
    obtenerCuartosFrios: () => Promise<void>;
}

export default function useGetCatalogs(): outType {
    const { url } = useEnvContext();
    const [cuartosFrios, setCuartosFrios] = useState<cuartosFriosType[]>([]);

    const obtenerCuartosFrios = async () => {
        try {
            const response = await fetch(`${url}/dataSys/get_data_cuartosFrios`);
            const data = await response.json();
            if(data.status !== 200) {
                throw new Error(`Error al obtener los cuartos fríos: ${data.message}`);
            }
            setCuartosFrios(data.data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron obtener los cuartos fríos');
        }
    };
    return {
        cuartosFrios,
        obtenerCuartosFrios,
    };
}
