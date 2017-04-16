import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';


class GameControls extends Component {

    handleQuitGame() {
        this.props.dispatch(push("/"));
    }

    render() {
        return (
            <div className="game__controls">
                <div className="row">
                    <div className="col col-xs-6">
                        <button className="btn btn-secondary btn-block" onClick={ this.props.onGameStart }>Start</button>
                    </div>
                    <div className="col col-xs-6">
                        <button className="btn btn-default btn-block" onClick={ this.handleQuitGame.bind(this) }>Back to lobby</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

export default connect(mapStateToProps)(GameControls);
