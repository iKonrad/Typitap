import * as socketActions from "store/modules/socketModule";

const CODE_RECONNECT = 5001;
const CODE_DISCONNECT = 5000;

const socketMiddleware = (function(){
    let socket = null;


    const onOpen = (ws,store,token) => evt => {

        store.dispatch(socketActions.connected());
    };

    const onClose = (ws,store) => evt => {
        //Tell the store we've disconnected
        store.dispatch(socketActions.disconnected());
        if (evt.code === CODE_RECONNECT) {
            store.dispatch(socketActions.connect());
        }
    };

    const onMessage = (ws,store) => evt => {
        //Parse the JSON message received on the websocket
        var msg = JSON.parse(evt.data);

        if (msg.type === "CONNECTED") {
            store.dispatch(socketActions.setIdentifier(msg.data.identifier));
            return;
        }
        console.log("MESSAGE RECEIVED", msg);
        // Do some logic based on the message type
    };

    const onError = (ws, store) => evt => {
        console.log("ERR", evt);
    }

    const reconnect = (ws, store) => {

        socket.close();
        store.dispatch(socketActions.disconnected());
        store.dispatch(socketActions.connect());
    };

    return store => next => action => {

        switch(action.type) {

            //The user wants us to connect
            case socketActions.CONNECT:
                //Start a new connection to the server
                if(socket !== null) {
                    socket.close();
                }

                store.dispatch(socketActions.connecting());

                //Attempt to connect to the websocket server
                socket = new WebSocket(action.url);
                socket.onmessage = onMessage(socket,store);
                socket.onclose = onClose(socket,store);
                socket.onopen = onOpen(socket,store,action.token);
                socket.onerror = onError(socket, store);


                break;

            //The user wants us to disconnect
            case socketActions.DISCONNECT:
                if(socket !== null) {
                    socket.close();
                }
                socket = null;

                //Set our state to disconnected
                store.dispatch(socketActions.disconnected());
                break;


            case socketActions.RECONNECT:

                if(socket !== null) {
                    socket.close();
                }
                socket = null;
                store.dispatch(socketActions.disconnected());

                store.dispatch(socketActions.connect());
                break;
            case socketActions.JOIN_ROOM:

                if (socket !== null) {
                    socket.send(JSON.stringify({
                        type: "JOIN_ROOM",
                        room: action.roomId
                    }));
                }

            default:
                return next(action);
        }
    }

})();

export default socketMiddleware