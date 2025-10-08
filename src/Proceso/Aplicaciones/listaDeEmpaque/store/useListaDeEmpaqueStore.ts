import { create } from "zustand";
import { contenedoresType } from "../../../../../types/contenedores/contenedoresType";
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
    seleccion: string[]
    setSeleccion: (seleccion: string[]) => void
    EF1_id: string[]
    setEF1_id: (EF1_id: string[]) => void
    cuartosFriosInventario: string[]
    setCuartosFriosInventario: (cuartosFrios: string[]) => void
    cuartosFrios: { _id: string, nombre: string }[]
    setCuartosFrios: (cuartosFrios: { _id: string, nombre: string }[]) => void
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
    setSeleccion: (seleccion: string[]) => set({ seleccion }),
    EF1_id: [],
    setEF1_id: (EF1_id: string[]) => set({ EF1_id }),
    cuartosFriosInventario: [],
    setCuartosFriosInventario: (cuartosFrios: string[]) => set({ cuartosFriosInventario: cuartosFrios }),
    cuartosFrios: [],
    setCuartosFrios: (cuartosFrios: { _id: string, nombre: string }[]) => set({ cuartosFrios }),
}));
