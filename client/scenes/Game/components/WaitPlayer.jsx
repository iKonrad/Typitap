import React, {Component} from 'react';
import {connect} from 'react-redux';


class WaitPlayer extends Component {

    renderIcon() {
        return (
            <div className="player-waiting__icon">
                <i className="fa fa-user"> </i>
            </div>
        );
    }

    render() {

        return (
            <div className={ "player-waiting" + (this.props.joined ? " player-waiting--joined" : "") }>
                <div className="col col-xs-2">
                    { this.renderIcon() }
                </div>
                <div className="col col-xs-10">
                    <div className="player-waiting__details">
                        <div className="player-waiting__name">{ this.props.name }</div>
                    </div>
                </div>
            </div>
        );

    }

}

export default WaitPlayer;