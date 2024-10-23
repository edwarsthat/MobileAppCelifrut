/* eslint-disable prettier/prettier */
import { Socket } from 'socket.io-client';
import * as Keychain from "react-native-keychain";

export const socketRequest = async (socket: Socket, request:any):Promise<{status:number, data:any, cajasSinPallet?:any} >=> {
    return await new Promise((resolve, reject) => {
        socket.emit("Mobile", request, (serverResponse: any) => {
            if (serverResponse.status !== 200) {
                reject(new Error(`${serverResponse.message}`));
            }
            resolve(serverResponse);
        });
    });
};

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
