
import { create } from 'zustand';
import { tiposFrutasType } from '../../types/tiposFrutas';

type FrutaStore = {
    tiposFruta: tiposFrutasType[];
    isLoading: boolean;
    error: string | null;
    cargarFruta: (url: string) => Promise<void>;
};

const useTipoFrutaStore = create<FrutaStore>((set) => ({
    tiposFruta: [],
    isLoading: false,
    error: null,

    cargarFruta: async (url: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const request = {
                action: "get_data_tipoFruta2",
            };
            const response = await fetch(`${url}/data/get_data_tipoFruta2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await response.json();

            if (data.status !== 200) {
                throw new Error('Error al cargar los tipos de fruta');
            }
            set({ tiposFruta: data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
        }
    },
}));


export default useTipoFrutaStore;
