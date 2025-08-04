import { create } from "zustand";
import { contenedoresType } from "../../../../../types/contenedoresType";
import { predioType } from "../../../../../types/predioType";

type ListaEmpaqueStates =  {
    contenedor: contenedoresType | null
    seleccionarContenedor: (contenedor: contenedoresType) => void
    loteSeleccionado: predioType | null
    seleccionarLote: (lote: predioType) => void
    pallet: number
    seleccionarPallet: (pallet: number) => void
    anchoDeVista: number
    setAnchoDeVista: (ancho: number) => void
    seleccion: number[]
    setSeleccion: (seleccion: number[]) => void
}

export const useListaDeEmpaqueStore = create<ListaEmpaqueStates>((set) => ({
    contenedor: null,
    seleccionarContenedor: (contenedor: contenedoresType) => set({ contenedor }),
    loteSeleccionado: null,
    seleccionarLote: (lote: predioType) => set({ loteSeleccionado: lote }),
    pallet: -1,
    seleccionarPallet: (pallet: number) => set({ pallet }),
    anchoDeVista: 0,
    setAnchoDeVista: (ancho: number) => set({ anchoDeVista: ancho }),
    seleccion: [],
    setSeleccion: (seleccion: number[]) => set({ seleccion }),
}));
