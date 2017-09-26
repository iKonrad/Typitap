import * as GameActions from 'store/ducks/gameModule';
import * as SocketActions from 'store/ducks/socketModule';

import React from 'react';
import {getStore} from "#app/store/store";


export function startTimer() {
    this.timer = setInterval(() => {
        getStore().dispatch(GameActions.tickTime());
        // We want the data to be sent only for multiplayer games
        if (getStore().getState().game.online) {
            // Sends updates to the websocket server about the current game
            getStore().dispatch(GameActions.updatePlayerData(getStore().getState().game.currentIndex))
        }

        if (getStore().getState().game.finished) {
            this.stopTimer();
        }

    }, 1000);
}

export function stopTimer() {
    clearInterval(this.timer);
}

export function startGame(online) {
    getStore().dispatch(GameActions.startGame(online));
    this.startTimer();
}

export function startCountdown(callback) {
    getStore().dispatch(GameActions.startCountdown(5));
    this.countdownTimer = setInterval(() => {
        if (getStore().getState().game.countdownSeconds === 1) {
            clearInterval(this.countdownTimer);
            callback();
            return;
        }
        getStore().dispatch(GameActions.tickCountdown());
    }, 1000);
}


export function resetGame() {
    clearInterval(this.timer);
    clearInterval(this.countdownTimer);
    if (getStore().getState().game.online) {
        getStore().dispatch(SocketActions.leaveRoom());
    }

    getStore().dispatch(GameActions.resetGame());
}


export function finishGame() {

    // Stop the game timer
    this.stopTimer();

    getStore().dispatch(GameActions.finishInput());

    // Mark the game as finished
    if (getStore().getState().game.online) {
        getStore().dispatch(GameActions.completeGame());
        return;
    }

    let state = getStore().getState().game;
    let userState = getStore().getState().user;

    let results = {
        'time': state.time,
        'mistakes': JSON.stringify(state.mistakes),
        'sessionId': state.room.id,
        'playback': JSON.stringify(state.playback),
    };

    if (!userState.loggedIn) {
        results['user'] = getStore().getState().socket.identifier;
    }

    // Post the results to the server
    this.postGameResultData(results).then((response) => {
        if (response.success) {
            getStore().dispatch(GameActions.finishGame(response.data.wpm, response.data.accuracy, response.data.points, response.resultId));
        }
    });

}

export function postGameResultData(results) {

    const formData = new FormData();
    for (var i in results) {
        formData.append(i, results[i]);
    }

    return fetch("/api/game/session/result", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
    }).then((response) => {
        return response.json();
    }).then((response) => {
        return response;
    });

}

