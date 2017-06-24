import React from 'react';
import * as GameUtils from 'utils/gameUtils';
import ReactDOMServer from 'react-dom/server';
import * as gaUtils from 'utils/gaUtils';

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
            time: 0,
        }
    }

    renderText() {

        let index = this.props.text.length - this.state.playText.length;

        if (!this.state.playing || index === 0) {
            let words = this.props.text;
            words = words.split(" ");
            words = GameUtils.renderText(this.props.mistakes, words);
            return words.join(" ");
        }

        let greyText = this.props.text.slice(index * -1);
        let finalText = (<p><span>{this.state.playText}</span><span className="game__text--guide">{ greyText }</span></p>);
        return ReactDOMServer.renderToStaticMarkup(finalText);

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
                gaUtils.logEvent("User", "Watching playback for game result", this.props.resultId);
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
        state.time = 0;
        this.setState(state);
        let that = this;
        let previousTime = 0;

        (function fn(i) {

            if (!that.state.playing) {
                return;
            }

            if (i < that.state.playback.length) {


                let currentItem = that.state.playback[i];

                playTimeout = setTimeout(function () {
                    that.parsePlaybackItem(currentItem);
                    fn(++i);
                    previousTime = currentItem.t;
                    let state = that.state;
                    state.time = parseInt(currentItem.t / 1000);
                    that.setState(state);
                }, (currentItem.t - previousTime) / 2)
            };
        }(0));
    }

    componentWillUnmount() {
        this.stop();
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
                this.stop();
                break;
        }

        this.setState(state);
    }

    renderTime() {
        return <div className="game__text__playback__time">{ GameUtils.formatTime(this.state.time) }</div>;
    }



    render() {
        return (
            <div>
                <div className="game__text">
                    <p dangerouslySetInnerHTML={{__html: this.renderText()}}>
                    </p>
                </div>
                <div className="game__text__playback">
                    { this.renderPlayButton() } { this.renderTime() }
                </div>
            </div>
        );
    }
}

export default ScorePopoverPlayback;