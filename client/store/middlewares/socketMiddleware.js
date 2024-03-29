import * as socketActions from "store/ducks/socketModule";
import * as gameActions from "store/ducks/gameModule";
import Notifications from 'utils/notifications';
import * as appActions from 'store/ducks/appModule';
import * as GameEngine from 'utils/gameEngine';

import React from 'react';

const CODE_RECONNECT = 5001;
const CODE_DISCONNECT = 5000;

const socketMiddleware = (function () {
    let socket = null;


    const onOpen = (ws, store, token) => evt => {

        store.dispatch(socketActions.connected());
    };

    const onClose = (ws, store) => evt => {
        //Tell the store we've disconnected
        store.dispatch(socketActions.disconnected());
        if (evt.code === CODE_RECONNECT) {
            store.dispatch(socketActions.connect());
        }
    };

    const onMessage = (ws, store) => evt => {
        //Parse the JSON message received on the websocket
        var msg = JSON.parse(evt.data);
        switch (msg.type) {
            case "CONNECTED":
                store.dispatch(socketActions.setIdentifier(msg.data.identifier));
                break;
            case "JOINED_ROOM":
                store.dispatch(gameActions.joinedRoom(msg.data.roomId, msg.data.players, msg.data.text, msg.data.online, msg.data.product));
                break;
            case "LEFT_ROOM":
                store.dispatch(gameActions.leftRoom());
                store.dispatch(gameActions.resetGame());
                break;
            case "PLAYER_JOINED_ROOM":
                store.dispatch(gameActions.playerJoinedRoom(msg.data.player));
                break;
            case "PLAYER_LEFT_ROOM":
                store.dispatch(gameActions.playerLeftRoom(msg.data.identifier));
                break;
            case "START_COUNTDOWN":
                store.dispatch(appActions.closeOnlineSidebar());
                store.dispatch(gameActions.startCountdown(msg.data.seconds));
                break;
            case "TICK_COUNTDOWN":
                store.dispatch(gameActions.setCountdown(msg.data.seconds));
                break;
            case "STOP_COUNTDOWN":
                store.dispatch(gameActions.stopCountdown());
                break;
            case "START_WAIT_COUNTDOWN":
                store.dispatch(gameActions.startWaitCountdown(msg.data.seconds));
                break;
            case "TICK_WAIT_COUNTDOWN":
                store.dispatch(gameActions.setWaitCountdown(msg.data.seconds));
                break;
            case "STOP_WAIT_COUNTDOWN":
                store.dispatch(gameActions.stopWaitCountdown());
                break;
            case "UPDATE_PLAYERS_DATA":
                store.dispatch(gameActions.updatePlayersData(msg.data.players));
                break;
            case "PLAYER_COMPLETED_GAME":
                store.dispatch(gameActions.setPlayerCompleted(msg.data.identifier, msg.data.place, msg.data.wpm));
                break;
            case "START_GAME":
                GameEngine.startGame(true);
                break;
            case "FINISH_GAME":
                let wpm = msg.data.wpm !== undefined ? msg.data.wpm : 0;
                let accuracy = msg.data.accuracy !== undefined ? msg.data.accuracy : 0;
                let points = msg.data.points !== undefined ? msg.data.points : 0;
                let resultId = msg.data.resultId;
                store.dispatch(gameActions.finishGame(wpm, accuracy, points, resultId));
                break;
            case "ONLINE_GAME_PLAYERS_SET":
                store.dispatch(appActions.setOnlineRoomPlayers(msg.data.players));
                break;
            case "TYPE_ONLINE_GAME_COUNTDOWN_STARTED":
                store.dispatch(appActions.setOnlineRoomCountdownStarted());
                break;
            case "TYPE_ONLINE_GAME_COUNTDOWN_STOPPED":
                store.dispatch(appActions.setOnlineRoomCountdownStopped());
                break;
            case "TYPE_ONLINE_GAME_COUNTDOWN_SET":
                store.dispatch(appActions.setOnlineRoomCountdownSeconds(msg.data.seconds));
                break;
            case "TYPE_ONLINE_GAME_RESET":
                store.dispatch(appActions.resetOnlineRoom());
                break;
        }
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

        switch (action.type) {
            //The user wants us to connect
            case socketActions.CONNECT:
                //Start a new connection to the server
                if (socket !== null) {
                    socket.close();
                }

                store.dispatch(socketActions.connecting());

                //Attempt to connect to the websocket server
                socket = new WebSocket(action.url);
                socket.onmessage = onMessage(socket, store);
                socket.onclose = onClose(socket, store);
                socket.onopen = onOpen(socket, store, action.token);
                socket.onerror = onError(socket, store);
                break;

            //The user wants us to disconnect
            case socketActions.DISCONNECT:
                if (socket !== null) {
                    socket.close();
                }
                socket = null;

                //Set our state to disconnected
                store.dispatch(socketActions.disconnected());
                break;


            case socketActions.RECONNECT:

                if (socket !== null) {
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
                        online: action.online,
                        language: store.getState().game.language,
                    }));
                }
                break;
            case socketActions.LEAVE_ROOM:
                if (socket !== null) {
                    socket.send(JSON.stringify({
                        type: "LEAVE_ROOM"
                    }));
                }
                break;
            case gameActions.UPDATE_PLAYER_DATA:
                if (store.getState().game.online) {
                    if (socket !== null) {
                        socket.send(JSON.stringify({
                            type: "UPDATE_PLAYER_DATA",
                            score: action.score,
                        }));
                    }
                }
                break;
            case gameActions.COMPLETE_GAME:
                if (store.getState().game.online) {
                    if (socket !== null) {
                        socket.send(JSON.stringify({
                            type: "COMPLETE_PLAYER_GAME",
                            mistakes: store.getState().game.mistakes,
                            playback: JSON.stringify(store.getState().game.playback),
                        }))
                        ;
                    }
                }

                next(action);
                break;
            default:
                return next(action);
        }
    }

})();

export default socketMiddleware