import React, { Component } from 'react';
import { connect } from 'react-redux';

class GameBar extends Component {

    formatTime(time) {
            let minutes = parseInt(time / 60);
            minutes = minutes > 9 ? minutes : '0' + minutes;
            let seconds = time % 60;
            seconds = seconds > 9 ? seconds : '0' + seconds;

            return minutes + ':' + seconds;
    }

    render() {

        return (
            <div className="game__bar">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="pull-left">
                            <div className="game__bar__label">{ Object.keys(this.props.game.mistakes).length }</div> <i className=" game__bar__icon fa fa-bomb"> </i>
                        </div>
                        <div className="pull-right">
                            <i className="fa fa-clock-o game__bar__icon "> </i> <div className="game__bar__label">{ this.formatTime(this.props.game.time) }</div>
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