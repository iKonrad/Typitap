/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import GameInput from './GameInput'
import GameText from './GameText';
import GameBar from './GameBar';
import GameEngine from './../utils/gameEngine';
import GameControls from './GameControls';
import GameCountdown from './GameCountdown';
import * as GameActions from 'store/modules/gameModule';
import * as SocketActions from 'store/modules/socketModule';

class Game extends Component {

    constructor(props) {
        super(props);
        this.engine = new GameEngine();
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
        this.handleGameStart();
    }

    componentWillUnmount() {
        this.engine.resetGame();
        this.props.dispatch(SocketActions.leaveRoom());
    }

    handleGameStart() {

        let that = this;
        this.props.dispatch(GameActions.getSession(this.props.online)).then((response) => {
            if (response.success) {

                // We're added to the session, now, join the room and wait for the players
                this.props.dispatch(GameActions.startOnlineSearch(response.sessionId));

                if (!that.props.online) {
                    this.engine.startCountdown(() => {
                        this.props.dispatch(GameActions.startGame(response.text, that.props.online, response.sessionId));
                        this.engine.startTimer();
                    });
                } else {
                    this.props.dispatch(SocketActions.joinRoom(response.sessionId));
                }
            }
            else {
                // @TODO: Handle error for end user
                alert("Ooops. Error while fetching a session.");
            }
        });

    }

    handleGameFinish() {
        this.engine.finishGame();
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
    }
};

export default connect(mapStateToProps)(Game);