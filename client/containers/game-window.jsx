import React, {Component} from 'react';
import {connect} from 'react-redux';

class GameWindow extends Component {

    static onEnter({state, nextState, replaceState, callback}) {
        callback();
    }


    render() {

        return (
            <div className="">Game</div>
        );

    }

}


const mapStateToProps = (state) => {
    return {
        game: state.game,
    }
};

export default connect(mapStateToProps)(GameWindow);
