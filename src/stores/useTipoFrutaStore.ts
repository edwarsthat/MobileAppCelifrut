
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

            const response = await fetch(`${url}/dataSys/get_data_tipoFruta2`);
            const data = await response.json();
            if (data.status !== 200) {
                throw new Error('Error al cargar los tipos de fruta');
            }
            console.log('Tipos de fruta store:', data.data);
            set({ tiposFruta: data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
        }
    },
}));


export default useTipoFrutaStore;
