import * as Keychain from "react-native-keychain";

export const obtenerAccessToken = async () => {
    try{
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) {
            throw new Error("Error no hay token de validadcion");
        }
        const { password } = credentials;
        return password;
    } catch(err){
        throw err;
    }
};
