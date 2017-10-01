import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import * as AppActions from 'store/ducks/appModule';
import * as GameEngine from 'utils/gameEngine';
import * as SocketActions from "#app/store/ducks/socketModule";

class OnlineRoomPanel extends React.Component {

    constructor(props) {
        super(props);

        let hasJoined = props.game.room.id !== "" && props.game.online;
        this.state = {
            scroll: -40,
            joined: hasJoined,
            players: hasJoined ? props.game.room.players : props.app.onlineRoom.players,
            countdownStarted: hasJoined ? props.game.waitCountdown : props.app.onlineRoom.waitCountdown,
            countdownSeconds: hasJoined ? props.game.waitCountdownSeconds : props.app.onlineRoom.waitCountdownSeconds,
        }

        this.scrollHandler = this.handleScroll.bind(this)
    }

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    // Runs after side-server rendering
    static initialize(response, params, store) {
        return "";
    }

    // Redirects to the game screen on game countdown
    componentWillReceiveProps(newProps) {
        let hasJoined = newProps.game.room.id !== "" && newProps.game.online;
        let state = {
            joined: hasJoined,
            scroll: -40,
            players: hasJoined ? newProps.game.room.players : newProps.app.onlineRoom.players,
            countdownStarted: hasJoined ? newProps.game.waitCountdown : newProps.app.onlineRoom.waitCountdown,
            countdownSeconds: hasJoined ? newProps.game.waitCountdownSeconds : newProps.app.onlineRoom.waitCountdownSeconds,
        };
        this.setState(state);

        // Handle online room join
        if (newProps.game.online) {
            if (!this.props.game.countdown && newProps.game.countdown) {
                this.props.dispatch(push("/play/game"));
            }
        } else {
            // Handle offline room join
            if (this.props.game.room.id === "" && newProps.game.room.id !== undefined  && newProps.game.room.id !== "") {
                this.props.dispatch(push("/play/game"));
            }
        }

    }

    handleScroll(e) {
        if (typeof window !== "undefined" && this !== undefined) {
            let scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
            let state = this.state;
            let scrollOffset = -40;
            state.scroll = scrollPos <= 70 ? scrollOffset + (scrollPos * -1) : -110;
            this.setState(state);
        }
    }

    componentDidMount() {
        if (typeof window !== "undefined") {
            window.addEventListener('scroll', this.scrollHandler);
        }
    }

    componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }

    toggleSidebar() {
        this.props.dispatch(this.props.app.onlineSidebarOpen ? AppActions.closeOnlineSidebar() : AppActions.openOnlineSidebar())
    }

    renderPlayers() {
        let maxPlayers = 5;
        let output = [];

        let playersCount = 0;
        let that = this;

        if (this.state.players !== undefined && Object.keys(this.state.players).length > 0) {
            output = Object.keys(this.state.players).map((identifier, index) => {
                let user = that.state.players[identifier];
                return (
                    <div className="player-slot--joined" key={`player-${index}`}>
                        {user.identifier}
                    </div>
                );
                return "";
            });
            playersCount = this.state.players !== undefined ? Object.keys(this.state.players).length : 0;
        }

        let playersLeft = 5 - playersCount;
        if (playersLeft > 0) {
            for (let i = 1; i <= playersLeft; i++) {
                output.push(
                    <div className="player-slot--free" key={"guest-" + i}>
                        Waiting...
                    </div>
                );
            }
        }
        return output;
    }

    handleJoinButtonClick() {
        GameEngine.resetGame();
        if (this.props.game.room === undefined || this.props.game.room.id === "") {
            this.props.dispatch(SocketActions.joinRoom(true));
        }
    }

    renderJoinButton() {
        if (!this.props.game.started && !this.props.game.countdown) {
            if (this.props.game.room !== undefined && this.props.game.room.id !== "" && this.props.game.online) {
                return (
                    <button className="btn btn-white btn-block"
                            onClick={this.handleJoinButtonClick.bind(this)}>Leave room</button>
                );
            }
            return (
                <button className="btn btn-success btn-block" onClick={this.handleJoinButtonClick.bind(this)}>Join
                    room</button>
            );
        }

        return <div></div>
    }

    renderPlayersCountBadge() {
        let playersCount = this.state.players !== undefined ? Object.keys(this.state.players).length : 0;
        if (this.state.joined && this.state.countdownStarted) {
            return (
                <div className={`badge badge-danger`}>{ this.state.countdownSeconds }</div>
            );
        } else {
            return (
                <div className={`badge ${ playersCount > 0 ? "badge--has-players" : ""}`}>{ playersCount }</div>
            );
        }
    }

    renderCountdown() {
        if (this.state.countdownStarted) {
            return (
                <div className="text-center">
                    <p className="game-counter-label">Game starting in:</p>
                    <div className="game-counter">
                        00:{ this.state.countdownSeconds >= 10 ? this.state.countdownSeconds : "0" + this.state.countdownSeconds }
                    </div>
                </div>
            );
        }
        return "";
    }

    render() {
        return (
            <div className={`fixed-sidebar ${ !this.props.app.onlineSidebarOpen ? "fixed-sidebar--closed" : "" }`}
                 style={{marginTop: (this.state.scroll) + "px"}}>
                <div className="fixed-sidebar__handle" onClick={this.toggleSidebar.bind(this)}>
                    { this.renderPlayersCountBadge() }
                    <div className="fa fa-flag-checkered fa-2x"></div>
                </div>
                <div className="col col-xs-12">
                    <div className="text-center white">
                        <h3 className="white margin-top-4">Online Room</h3>
                        <div style={{maxWidth: "60px", marginLeft: "auto", marginRight: "auto"}}>
                            <hr/>
                        </div>
                        <div>
                            <span
                                className="text-success">{this.state.players !== undefined ? Object.keys(this.state.players).length : 0}</span> players
                            joined
                        </div>
                    </div>
                    {this.renderPlayers()}
                    {this.renderJoinButton()}
                    {this.renderCountdown()}
                    <div className="well">
                        <p className="white">The game will start automatically when there are at least 2 players in the room. While you're waiting, you can also browse typitap or <strong>invite your friends</strong> to play with you.</p>
                    </div>
                </div>

            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        game: state.game,
        user: state.user,
        app: state.app,
        socket: state.socket,
    };
};

export default connect(mapStateToProps)(OnlineRoomPanel);