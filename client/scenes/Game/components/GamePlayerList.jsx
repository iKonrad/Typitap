/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

class PlayerList extends Component {

    renderPlayersProgress() {
        let that = this;
        let players = this.props.game.room.players;
        if (players !== undefined && Object.keys(players).length > 0) {
            return Object.keys(players).map((obj) => {

                if (obj === that.props.socket.identifier) {
                    return "";
                }

                let player = players[obj];
                let words = that.props.game.text.split(" ").length;
                let current = player.completed ? (words + 1) : player.score;

                return (
                    <div className="" key={ 'progress-' + obj }>
                        <div className={`game__progress__name ${player.left ? "game__progress__name--left" : ""}`}>{ obj }</div>
                        <div className="progress">
                            <div
                                className={`progress-bar progress-bar-${player.left ? "default" : "success"}`}
                                role="progressbar"
                                aria-valuenow={ current }
                                aria-valuemin="0"
                                aria-valuemax={ words }
                                style={{ 'width': ((current / words) * 100) + '%' }}>
                            </div>
                        </div>
                        { that.renderPlace(player.place) }
                    </div>
                );
            });
        } else {
            return "";
        }

    }


    renderPlace(place) {
        if (place !== undefined && place > 0) {
            let placeString = '';
            if (place === 1) {
                placeString = 'st';
            } else if (place === 2) {
                placeString = 'nd';
            } else if (place === 3) {
                placeString = 'rd';
            } else {
                placeString = 'th';
            }
            return (
                <div className="progress__result__wrapper">
                    <div className="progress__result">
                        <i className={ "fa fa-trophy progress__result__icon place-" + place }> </i>
                        <div className="progress__result__place">{place}{placeString}</div>
                    </div>
                </div>
            );
        }
    }

    render() {

        let words = this.props.game.text.split(" ").length;
        let current = 0;
        if (this.props.game.online) {
            current = this.props.game.finished && this.props.game.room.players[this.props.socket.identifier].completed ? words : this.props.game.currentIndex;
        } else {
            current = this.props.game.finished ? words : this.props.game.currentIndex;;
        }

        let place = 0;
        if (this.props.game.room.players !== undefined && this.props.game.room.players[this.props.socket.identifier] !== undefined) {
            place = this.props.game.room.players[this.props.socket.identifier].place;
        }

        return(
            <div className="game__progress">
                { this.renderPlayersProgress() }
                <div className="" key="progress-player">
                    <div className="game__progress__name" style={{ fontWeight: 'bold' }}>{ this.props.socket.identifier }</div>
                    <div className="progress">
                        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={ current } aria-valuemin="0" aria-valuemax={ words } style={{ 'width': ((current / words) * 100) + '%' }}>
                        </div>
                    </div>
                    { this.renderPlace(place) }
                </div>
            </div>
        );

    }

}


const mapStateToProps = (state) => {
    return {
        app: state.app,
        game: state.game,
        socket: state.socket,
    }
};

export default connect(mapStateToProps)(PlayerList);