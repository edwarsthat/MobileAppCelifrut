import { create } from "zustand"
import { CargoType } from "../../types/cargosType";
import * as Keychain from 'react-native-keychain';

interface sessionStoreType {
    isAuth: boolean,
    user: string | null
    cargo: string | null
    token: string | null
    permisos: CargoType | undefined
    login: (user: string, password: string, url: string) => Promise<void>
    logout: () => Promise<void>
}

const useSessionStore = create<sessionStoreType>((set) => ({
    isAuth: false,
    user: null,
    cargo: null,
    token: null,
    permisos: undefined,
    login: async (user, password, url) => {
        let responseJSON: Response;
        try {
            responseJSON = await fetch(`${url}/login2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    password: password,
                }),
            });
        } catch (err){
            console.error(err)
            throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
        }
        const response = await responseJSON.json();
        console.log(response)
        if (response.status !== 200) {
            throw new Error(response.message ?? "Usuario o contraseña incorrectos")
        }
        await Keychain.setGenericPassword('user', response.accesToken);

        set({
            isAuth: true,
            user: response.user,
            token: response.accesToken,
            cargo: response.cargo,
            permisos: response.permisos
        })
    },
    logout: async () => {
        await Keychain.resetGenericPassword()
        set({isAuth:false, user:null, cargo:null, permisos:undefined, token:null})
    }
}))

export default useSessionStore