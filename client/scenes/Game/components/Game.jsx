/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlayerList from './PlayerList';

class Game extends Component {

    render() {
        return (
            <div id="game" className="game-container">
                <PlayerList />
                <div className="panel panel-default">
                    <div className="panel-body">

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