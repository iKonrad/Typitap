/*
    GameWindow.jsx
    GameWindow is a presentational component that shows the Game page

 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Game from './components/Game';

class GameWindow extends Component {

    static onEnter({state, nextState, replaceState, callback}) {
        callback();
    }


    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 col-md-8 col-md-offset-2">
                        <Game />
                    </div>
                </div>
            </div>
        );

    }

}


const mapStateToProps = (state) => {
    return {
        game: state.game,
    }
};

export default connect(mapStateToProps)(GameWindow);
