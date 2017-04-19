export const CONNECT = "@@socket/CONNECT";
export const DISCONNECT = "@@socket/DISCONNECT";
const CONNECTING = "@@socket/CONNECTING";

const CONNECTED = "@@socket/CONNECTED";
const DISCONNECTED = "@@socket/DISCONNECTED";

const SOCKET_URL= "ws://localhost:5000/ws";

const initialState = {
    connected: false,
    connecting: false,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CONNECTED:
            return {
                ...state,
                connected: true,
                connecting: false,
            }
        case DISCONNECTED:
            return {
                ...state,
                connected: true,
                connecting: false,
            }
        case CONNECTING:
            return {
                ...state,
                connecting: true,
            }
    }

    return state;
}


export function connect() {
    return {type: CONNECT, url: SOCKET_URL};
}

export function disconnect() {
    return {type: DISCONNECT};
}

export function connecting() {
    return {type: CONNECTING};
}

export function connected() {
    return {type: CONNECTED};
}

export function disconnected() {
    return {type: DISCONNECTED};
}
