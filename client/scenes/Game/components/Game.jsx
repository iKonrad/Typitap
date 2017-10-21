/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {push} from 'react-router-redux';
import GameInput from './GameInput'
import Spinner from 'components/app/Spinner';
import GameText from './GameText';
import GameBar from './GameBar';
import * as GameEngine from 'utils/gameEngine';
import GameCountdown from './GameCountdown';
import GamePlayerList from './GamePlayerList';
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
                        <GameBar/>
                        {this.renderMain()}
                    </div>
                </div>
                {this.renderResultModal()}
            </div>
        )
    }

    componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener('beforeunload', this.onUnload );
        }
        this.resetGame();
    }

    resetGame() {
        GameEngine.resetGame();
    }

    componentDidMount() {
        // Check if the room ID has been passed over
        if (this.props.game.room.id === "") {
            this.props.dispatch(push("/play"));
            return;
        }

        if (typeof window !== "undefined") {
            window.addEventListener('beforeunload', this.onUnload );
        }

        // We've got the room ID, we can now proceed to start the game
        if (!this.props.online) {
            GameEngine.startCountdown(() => {
                GameEngine.startGame(false);
            });
        }
    }

    renderMain() {
        if (this.props.game.online) {
            // If online, display the text when the game is started or countdown has started
            if (this.props.game.started || this.props.game.countdown) {
                return (
                    <div>
                        <GameText/>
                        {this.renderBottomRow()}
                    </div>
                );
            }
        } else {
            // For offline game, show the game screen immediately
            return (
                <div>
                    <GameText/>
                    {this.renderBottomRow()}
                </div>
            );
        }
    }

    renderBottomRow() {
        if (this.props.game.started && !this.props.game.finished) {
            if (this.props.game.finishedInput) {
                return <Spinner/>
            } else {
                return <GameInput onGameFinish={ GameEngine.finishGame.bind(this) }/>;
            }
        } else {
            if (this.props.game.countdown) {
                return <GameCountdown/>
            }
        }
        return "";
    }

    renderResultModal() {
        if (this.props.game.finished) {
            return <GameResultModal open={true}/>
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