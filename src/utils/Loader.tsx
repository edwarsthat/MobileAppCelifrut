import { useAppStore } from "../stores/useAppStore";
import useTipoFrutaStore from "../stores/useTipoFrutaStore";
import { useEffect } from "react";
import { Alert } from "react-native";

type propsType = {
    url: string;
}

export default function Loader({ url }: propsType): null {
    const setLoading = useAppStore((state) => state.setLoading);
    const cargarFruta = useTipoFrutaStore((s) => s.cargarFruta);
    const tiposFruta = useTipoFrutaStore((s) => s.tiposFruta);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (!tiposFruta.length) {
                    cargarFruta(url);
                }
            } catch (error) {
                if(error instanceof Error) {
                    Alert.alert("Error", error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [tiposFruta.length, cargarFruta]);

    return null;
}
