import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import WaitPlayer from './WaitPlayer';
import Modal from 'react-bootstrap/lib/Modal';


class WaitPlayersModal extends Component {

    renderTitle() {
        if (this.props.game.room.id !== "") {
            // Joined the session, display the looking for players modal
            let playersCount = 1;

            if (this.props.game.room.players !== undefined) {
                playersCount = Object.keys(this.props.game.room.players).length;
            }

            return `Looking for players... (${playersCount}/5)`;
        } else {
            return "Looking for session...";
        }
    }

    renderBody() {
        if (this.props.game.room.id !== "") {

            // Joined the session, display the looking for players modal
            let html = "";
            let players = [];
            let that = this;

            if (this.props.game.room.players !== undefined && Object.keys(this.props.game.room.players).length > 0) {
                players = Object.keys(this.props.game.room.players).map((identifier, index) => {

                    let user = that.props.game.room.players[identifier];
                    if (identifier !== this.props.socket.identifier) {
                        return (
                            <div className="col col-xs-6" key={ "player-" + index }>
                                <WaitPlayer joined={ true } name={ user.identifier }/>
                            </div>
                        );
                    }
                    return "";

                });
            }

            // For the rest, use "waiting for player" placeholder
            let playersCount = this.props.game.room.players !== undefined ? Object.keys(this.props.game.room.players).length : 0;
            let playersLeft = 4 - playersCount + 1;

            if (playersLeft > 0) {
                for (let i = 1; i <= playersLeft; i++) {
                    players.push(<div className="col col-xs-6" key={ "guest-" + i }>
                            <WaitPlayer joined={ false } name="Waiting for player..." identifier=""/>
                        </div>
                    );
                }
            }

            return players;

        } else {
            return "";
        }
    }


    renderCountdown() {

        if (this.props.game.waitCountdown) {
            return (
                <div className="row">
                    <div className="wait-countdown">
                        00:{ this.props.game.waitCountdownSeconds >= 10 ? this.props.game.waitCountdownSeconds : "0" + this.props.game.waitCountdownSeconds }
                    </div>
                </div>
            );
        }

        return "";
    }


    render() {
        return (
            <div>
                <Modal show={this.state.showModal} className="game-modal">
                    <Modal.Header>
                        <Modal.Title><i className="fa fa-cog fa-spin fa-fw text-primary"> </i>{ this.renderTitle() }
                        </Modal.Title>
                        <div className="text-center">
                            { this.renderCountdown() }
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            { this.renderBody() }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link to="/play" className="btn btn-link text-secondary">Cancel</Link>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }


    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    componentDidMount() {
        this.setState({
            showModal: true
        });
    }


    constructor(props) {
        super(props);

        this.state = {
            open: props.open !== undefined ? props.open : false,
        }
    }

}

const
    mapStateToProps = (state) => {
        return {
            game: state.game,
            socket: state.socket,
        }
    };

export
default

connect(mapStateToProps)

(
    WaitPlayersModal
)
;


