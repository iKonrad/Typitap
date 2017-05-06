/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {push} from 'react-router-redux';
import GameInput from './GameInput'
import GameText from './GameText';
import GameBar from './GameBar';
import GameEngine from './../utils/gameEngine';
import GameControls from './GameControls';
import GameCountdown from './GameCountdown';
import WaitPlayersModal from './WaitPlayersModal';

import * as GameActions from 'store/modules/gameModule';
import * as SocketActions from 'store/modules/socketModule';

import Notifications from 'react-notification-system-redux';

class Game extends Component {

    constructor(props) {
        super(props);
        this.engine = new GameEngine();
        this.onUnload = this.resetGame.bind(this)
    }


    renderBottomRow() {
        if (this.props.game.started && !this.props.game.finished) {
            return <GameInput onGameFinish={ this.handleGameFinish.bind(this) }/>;
        } else {
            if (this.props.game.countdown) {
                return <GameCountdown />
            } else if (this.props.game.finished) {
                return <GameControls onGameStart={ this.handleGameStart.bind(this) }/>
            }

        }
    }

    componentWillMount() {
        // Check if the client is connected to the websocket.

        if (!this.props.socket.connected || this.props.socket.identifier === "") {
            let timeOut = setTimeout(() => {
                if (this.props.socket.connected) {
                    this.handleGameStart();
                } else {
                    this.props.dispatch(Notifications.warning({
                        'message': "You're not connected to the server. Refresh the page and try again.",
                        'title': "Connection issue"
                    }));
                    this.props.dispatch(push("/play"));
                }
            }, 1000);
        } else {
            this.handleGameStart();
        }

        // Leave rooms when the browser is closed
        if (typeof window !== "undefined") {
            window.addEventListener('beforeunload', this.onUnload);
        }

    }

    componentWillUnmount() {

        if (typeof window !== "undefined") {
            window.removeEventListener('beforeunload', this.onUnload);
        }

        this.resetGame();
    }

    resetGame() {
        console.log("resetting...");
        this.engine.resetGame();
        this.props.dispatch(SocketActions.leaveRoom());
    }

    handleGameStart() {
        this.props.dispatch(SocketActions.joinRoom(this.props.online));
    }

    handleGameFinish() {
        this.engine.finishGame();
    }


    componentWillReceiveProps(newProps) {
        // Check if the room ID has been passed over
        if ((!this.props.game.room.id || this.props.game.room.id === "") && newProps.game.room.id !== "") {
            // We've got the room ID, we can now proceed to start the game
            if (!this.props.online) {
                this.engine.startCountdown(() => {
                    this.props.dispatch(GameActions.startGame(this.props.online));
                    this.engine.startTimer();
                });
            } else {
                this.props.dispatch(GameActions.startOnlineSearch());
            }
        }
    }

    renderMain() {
        if (this.props.game.online) {
            // If online, display the text when the game is started or countdown has started
            if (this.props.game.started || this.props.game.countdown) {
                return (
                    <div>
                        <GameText />
                        { this.renderBottomRow() }
                    </div>
                );
            } else {
                // Otherwise, display a waiting for players message
                return (
                    <div className="text-center">
                        <WaitPlayersModal/>
                        Searching for players...
                    </div>
                );
            }
        } else {
            // For offline game, show the game screen immediately
            return (
                <div>
                    <GameText />
                    { this.renderBottomRow() }
                </div>
            );
        }
    }


    render() {
        return (
            <div id="game" className="game">
                <div className="panel panel-default">
                    <div className="panel-body">

                        <GameBar />
                        { this.renderMain() }
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        app: state.app,
        game: state.game,
        socket: state.socket,
    }
};

export default connect(mapStateToProps)(Game);