import { create } from "zustand";
import { io, Socket } from 'socket.io-client';

type SocketStore = {
    socket: Socket | null;
    connected: boolean;
    lastMessage: any;
    connect: (url: string, token: string) => void;
    disconnect: () => void;
    sendRequest: (payload: any) => Promise<any>;
};


export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connected: false,
    lastMessage: null,

    connect: (url: string, token: string) => {
        if (get().socket) { return; }
        const socket = io(url, {
            auth: { token },
            rejectUnauthorized: false,
        });

        socket.on('connect', () => set({ connected: true, socket }));
        socket.on('disconnect', () => set({ connected: false, socket: null }));
        socket.on('connect_error', (error) => {
            set({ connected: false, socket: null });
            // Aquí puedes usar un Alert si quieres, pero mejor repórtalo al componente
            console.warn('Error de conexión:', error);
        });

        // Ejemplo: Manejar mensajes del servidor
        socket.on('servidor', (data) => set({ lastMessage: { event: 'servidor', data } }));
        socket.on('predio_vaciado', (data) => set({ lastMessage: { event: 'predio_vaciado', data } }));
        socket.on('listaempaque_update', (data) => set({ lastMessage: { event: 'listaempaque_update', data } }));

        set({ socket });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
        }
        set({ socket: null, connected: false });
    },

    sendRequest: (payload: any): Promise<any> => {
        const socket = get().socket;
        if (socket && get().connected) {
            return new Promise((resolve, reject) => {
                socket.emit("Desktop2", payload, (response: any) => {
                    if (response && response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                });
            });
        } else {
            return Promise.reject("Socket no conectado");
        }
    },
}));
