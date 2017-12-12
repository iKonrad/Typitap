import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as GameUtils from 'utils/gameUtils';
import Icon from '@fortawesome/react-fontawesome';

class GameBar extends Component {

    render() {

        return (
            <div className="game__bar">
                <div className="row">
                    <div className="col">
                        <div className="float-left">
                            <div className="game__bar__label">{ Object.keys(this.props.game.mistakes).length }</div> <Icon icon={['fas', 'bug']} />
                        </div>
                        <div className="float-right">
                             <Icon icon={['fas', 'stopwatch']} /> <div className="game__bar__label">{ GameUtils.formatTime(this.props.game.time) }</div>
                        </div>
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

export default connect(mapStateToProps)(GameBar);