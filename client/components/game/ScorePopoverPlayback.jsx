import React from 'react';
import * as GameUtils from 'utils/gameUtils';

let playTimeout;

class ScorePopoverPlayback extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            playing: false,
            playback: [],
            startTime: 0,
            currentIndex: 0,
            playText: "",
        }
    }

    renderText() {

        if (!this.state.playing) {
            let words = this.props.text;
            words = words.split(" ");
            words = GameUtils.renderText(this.props.mistakes, words);
            return words.join(" ");
        }

        return this.state.playText;


    }

    renderPlayButton() {
        if (this.state.playing) {
            return <i className="fa fa-stop" onClick={ this.togglePlayback.bind(this) }></i>;
        }

        return <i className="fa fa-play" onClick={ this.togglePlayback.bind(this) }></i>;

    }

    togglePlayback() {

        if (this.state.playback.length === 0 && !this.state.loading) {
            let state = this.state;
            state.loading = true;
            this.setState(state);
            this.fetchPlaybackData();
            return;
        }

        if (this.state.playback.length > 0) {
            if (this.state.playing) {
                this.stop();
            } else {
                this.start();
            }
        }

    }

    fetchPlaybackData() {

        fetch(`/api/game/playbacks/${this.props.resultId}`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                if (response.data !== undefined && response.data !== null) {
                    let state = this.state;
                    if (response.data.playback.length === 0) {
                        alert("Couldn't fetch playback data for this game. Sorry");
                        state.loading = false;
                        return;
                    } else {
                        state.playback = response.data.playback;
                        this.togglePlayback();
                    }
                    this.setState(state);
                }
            }
        });

    }

    start() {
        let state = this.state;
        state.playing = true;
        state.loading = false;
        state.startTime = +new Date();
        state.currentIndex = 0;
        state.playText = "";
        this.setState(state);
        let that = this;
        let previousTime = 0;

        // 100 - start
        // 120 - n - start = 20
        // 140 - n - x
        //



        // console.log(this.state.playback);
        (function fn(i) {

            if (!that.state.playing) {
                return;
            }

            if (i < that.state.playback.length) {


                let currentItem = that.state.playback[i];

                // console.log("Delay", i, currentItem.t - previousTime)
                playTimeout = setTimeout(function () {
                    // console.log(currentItem);
                    that.parsePlaybackItem(currentItem);
                    fn(++i);
                    previousTime = currentItem.t;
                }, (currentItem.t - previousTime) / 2)
            };
        }(0));
    }

    stop() {
        let state = this.state;
        state.playing = false;
        state.loading = false;
        state.startTime = 0;
        state.currentIndex = 0;
        state.playText = "";
        this.setState(state);
        clearTimeout(playTimeout);
    }

    parsePlaybackItem(item) {
        let state = this.state;
        switch(item.a) {
            case "start":
                break;
            case "n":
                state.playText = GameUtils.insertCharacterAtIndex(state.playText, item.c, item.v);
                break;
            case "d":
                state.playText = GameUtils.removeCharacterAtIndex(state.playText, item.c);
                break;
            case "w":

                state.playText = state.playText + " ";
                break;
            case "end":
                console.log('stopping');
                this.stop();
                break;
        }

        this.setState(state);
    }



    render() {
        return (
            <div>
                <div className="game__text">
                    <p dangerouslySetInnerHTML={{__html: this.renderText()}}>
                    </p>
                </div>
                <div className="game__text__playback">
                    { this.renderPlayButton() }
                </div>
            </div>
        );
    }
}

export default ScorePopoverPlayback;