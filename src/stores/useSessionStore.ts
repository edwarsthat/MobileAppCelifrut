import { create } from "zustand"
import { envContext } from "../../App";
import { CargoType } from "../../types/cargosType";

interface sessionStoreType {
    isAuth: boolean,
    user: string | null
    cargo: string | null
    token: string | null
    permisos: CargoType | null
    login: (user: string, password: string) => Promise<void>
}

const useSessionStore = create<sessionStoreType>((set) => ({
    isAuth: false,
    user: null,
    cargo: null,
    token: null,
    permisos: null,
    login: async (user, password) => {
        const responseJSON = await fetch(`${envContext}/login2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user,
                password: password,
            }),
        });
        const response = await responseJSON.json();
        if(response.status !== 200){
            throw new Error("Credenciales invalidas")
        }
        set({
            isAuth:true,
            user:response.user,
            token: response.token,
            cargo: response.cargo,
            permisos: response.permisos
        })
    }
}))

export default useSessionStore