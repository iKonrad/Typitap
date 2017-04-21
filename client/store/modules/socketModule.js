export const CONNECT = "@@socket/CONNECT";
export const DISCONNECT = "@@socket/DISCONNECT";
export const RECONNECT = "@@socket/RECONNECT";
const CONNECTING = "@@socket/CONNECTING";

const CONNECTED = "@@socket/CONNECTED";
const DISCONNECTED = "@@socket/DISCONNECTED";
const SET_IDENTIFIER = "@@socket/SET_IDENTIFIER";



// const SOCKET_URL = "ws://46.101.2.64:5000/ws";
const SOCKET_URL = "ws://localhost:5000/ws";

const initialState = {
    connected: false,
    connecting: false,
    identifier: ""
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
                connected: false,
                connecting: false,
                identifier: "",
            }
        case CONNECTING:
            return {
                ...state,
                connecting: true,
            }
        case SET_IDENTIFIER:
            return {
                ...state,
                identifier: action.identifier,
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

export function setIdentifier(identifier) {
    return {type: SET_IDENTIFIER, identifier};
}

export function disconnected() {
    return {type: DISCONNECTED};
}


export function reconnect() {
    return {type: RECONNECT};
}