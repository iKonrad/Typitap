import React, { Component } from 'react';
import { connect } from 'react-redux';


class GameCountdown extends Component {

    render() {
        return (
            <div className="game__countdown">
                Starting in... <span>{ this.props.game.countdownSeconds }</span>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game,
    }
};

export default connect(mapStateToProps)(GameCountdown);