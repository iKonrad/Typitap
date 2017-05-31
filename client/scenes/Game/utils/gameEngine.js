import {getStore} from 'store/store';
import * as GameActions from 'store/ducks/gameModule';
import * as SocketActions from 'store/ducks/socketModule';
import Notifications from 'utils/notifications';

import React from 'react';

class GameEngine {


    constructor() {
        this.store = getStore();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.store.dispatch(GameActions.tickTime());
            // We want the data to be sent only for multiplayer games
            if (this.store.getState().game.online) {
                // Sends updates to the websocket server about the current game
                this.store.dispatch(GameActions.updatePlayerData(this.store.getState().game.currentIndex))
            }

            if (this.store.getState().game.finished) {
                this.stopTimer();
            }

        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    startGame(online) {
        this.store.dispatch(GameActions.startGame(online));
        this.startTimer();
    }

    startCountdown(callback) {
        this.store.dispatch(GameActions.startCountdown(5));
        this.countdownTimer = setInterval(() => {
            if (this.store.getState().game.countdownSeconds === 1) {
                clearInterval(this.countdownTimer);
                callback();
                return;
            }
            this.store.dispatch(GameActions.tickCountdown());
        }, 1000);
    }


    resetGame() {
        clearInterval(this.timer);
        clearInterval(this.countdownTimer);
        if (this.store.getState().game.online) {
            this.store.dispatch(SocketActions.leaveRoom());
        }

        this.store.dispatch(GameActions.resetGame());
    }



    finishGame() {

        // Stop the game timer
        this.stopTimer();

        // Mark the game as finished
        this.store.dispatch(GameActions.finishGame());

        if (!this.store.getState().game.online) {
            let state = this.store.getState().game;

            // Calculate the WPM and accuracy
            let seconds = state.time;
            let words = state.text.split(" ").length;

            // Divide the words into 5 character chunks to make WPM more reliable
            let characters = 0;
            state.text.split(" ").forEach((obj, index) => {
                characters += obj.length;
            });

            let virtualWords = Math.round(characters / 5);
            let speed = Math.round(virtualWords * (60 / seconds));
            let accuracy = 100 - ((Object.keys(state.mistakes).length / words) * 100).toFixed(1);
            let results = {
                'time': seconds,
                'wpm': speed,
                'accuracy': accuracy,
                'mistakes': JSON.stringify(state.mistakes),
                'sessionId': state.room.id,
            };

            // Post the results to the server
            this.postGameResultData(results);
            let mistakesCount = state.mistakes === undefined ? '0' : Object.keys(state.mistakes).length;

            this.store.dispatch(Notifications.gameCompleted(seconds, speed, accuracy, mistakesCount));
        }

    }

    postGameResultData(results) {

        const formData = new FormData();
        for (var i in results) {
            formData.append(i, results[i]);
        }

        fetch("/api/game/session/result", {
            method: "POST",
            credentials: "same-origin",
            body: formData,
        }).then((response) => {

            return response.json();
        }).then((response) => {
            console.log(response);
        });

    }

}


export default GameEngine;