
import { create } from 'zustand';
import { tiposFrutasType, calidadesType } from '../../types/tiposFrutas';

type FrutaStore = {
    tiposFruta: tiposFrutasType[];
    calidadesExport: calidadesType[];
    isLoading: boolean;
    error: string | null;
    cargarFruta: (url: string) => Promise<void>;
};

const useTipoFrutaStore = create<FrutaStore>((set) => ({
    tiposFruta: [],
    calidadesExport: [],
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
            set({ tiposFruta: data.data.tipoFrutas, calidadesExport: data.data.calidadesExport, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
        }
    },
}));


export default useTipoFrutaStore;
