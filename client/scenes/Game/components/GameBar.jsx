import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as GameUtils from 'utils/gameUtils';

class GameBar extends Component {

    render() {

        return (
            <div className="game__bar">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="pull-left">
                            <div className="game__bar__label">{ Object.keys(this.props.game.mistakes).length }</div> <i className=" game__bar__icon fa fa-bomb"> </i>
                        </div>
                        <div className="pull-right">
                            <i className="fa fa-clock-o game__bar__icon "> </i> <div className="game__bar__label">{ GameUtils.formatTime(this.props.game.time) }</div>
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