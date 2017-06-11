/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {push} from 'react-router-redux';
import GameInput from './GameInput'
import GameText from './GameText';
import GameBar from './GameBar';
import * as GameEngine from 'utils/gameEngine';
import GameControls from './GameControls';
import GameCountdown from './GameCountdown';
import GamePlayerList from './GamePlayerList';
import WaitPlayersModal from './WaitPlayersModal';
import Notifications from 'utils/notifications';
import * as GameActions from 'store/ducks/gameModule';
import * as SocketActions from 'store/ducks/socketModule';
import GameResultModal from 'components/game/GameResultModal';

class Game extends Component {

    constructor(props) {
        super(props);
        this.onUnload = this.resetGame.bind(this)
    }

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div id="game" className="game">
                <GamePlayerList/>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <GameBar />
                        { this.renderMain() }
                    </div>
                </div>
                { this.renderResultModal() }

            </div>
        )
    }

    componentWillMount() {
        // Check if the client is connected to the websocket.

        if (!this.props.socket.connected || this.props.socket.identifier === "") {
            let timeOut = setTimeout(() => {
                if (this.props.socket.connected) {
                    this.handleGameStart();
                } else {
                    this.props.dispatch(Notifications.connectionIssue());
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
        GameEngine.resetGame();
    }

    handleGameStart() {
        this.resetGame();
        this.props.dispatch(SocketActions.joinRoom(this.props.online));
    }

    handleGameFinish() {
        GameEngine.finishGame();
    }


    componentWillReceiveProps(newProps) {
        // Check if the room ID has been passed over


        if (Object.keys(newProps).length === 0) {
            return;
        }

        if ((!this.props.game.room.id || this.props.game.room.id === "") && newProps.game.room.id !== undefined && newProps.game.room.id !== "") {
            // We've got the room ID, we can now proceed to start the game
            if (!this.props.online) {
                GameEngine.startCountdown(() => {
                    GameEngine.startGame(this.props.online);
                });
            } else {
                this.props.dispatch(GameActions.startMatchmaking());
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

    renderResultModal() {
        if (this.props.game.finished) {
            return <GameResultModal open={ true }/>
        }
        return "";
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