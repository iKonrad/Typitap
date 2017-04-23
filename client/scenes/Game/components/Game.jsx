/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import GamePlayerList from './GamePlayerList';
import GameInput from './GameInput'
import GameText from './GameText';
import GameBar from './GameBar';
import GameEngine from './../utils/gameEngine';
import GameControls from './GameControls';
import GameCountdown from './GameCountdown';
import * as GameActions from 'store/modules/gameModule';

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
            } else {
                return <GameControls onGameStart={ this.handleGameStart.bind(this) } />
            }

        }
    }

    componentWillUnmount() {
        this.engine.resetGame();

    }

    handleGameStart() {

        // Check if offline or online game

        this.props.dispatch(GameActions.findSession());

        this.props.dispatch(GameActions.getSession(false)).then((response) => {
            if (response.success) {
                this.engine.startCountdown(() => {
                    this.props.dispatch(GameActions.startGame(response.text, false, response.sessionId ));
                    this.engine.startTimer();
                });
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


    render() {
        return (
            <div id="game" className="game">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <GameBar />
                        <GameText />
                        { this.renderBottomRow() }
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