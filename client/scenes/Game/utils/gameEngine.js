import {getStore} from 'store/store';
import * as GameActions from 'store/modules/gameModule';
import Notifications from 'react-notification-system-redux';
import React from 'react';

class GameEngine {


    constructor() {
        this.store = getStore();
    }

    startTimer() {

        let secondTimer = 0;
        this.timer = setInterval(() => {

            if (this.store.getState().game.started && !this.store.getState().game.finished) {
                this.store.dispatch(GameActions.tickTime());
            } else {
                this.stopTimer();
            }

        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }


    finishGame() {

        // Stop the game timer
        this.stopTimer();

        // Mark the game as finished
        this.store.dispatch(GameActions.finishGame());

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
            'mistakes': state.mistakes
        };

        // Post the results to the server
        // GameActions.submitGameResults(this.props.sessionid, results).then();

        let mistakesCount = state.mistakes === undefined ? '0' : Object.keys(state.mistakes).length;

        // Show notification with the results to the user
        this.store.dispatch(Notifications.success({
            children: (
                <p>Game finished in {seconds} seconds with score <strong>{speed}</strong> wpm. Your accuracy:
                    <strong>{ accuracy }%</strong> ({mistakesCount} mistakes)</p>)
        }));

    }


}


export default GameEngine;