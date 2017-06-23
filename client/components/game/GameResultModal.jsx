import React, {Component} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-bootstrap/lib/Modal';
import UserLevel from 'components/user/levels/UserLevel';
import StatsBadge from 'components/user/UserStatsBadge';
import * as GameUtils from 'utils/gameUtils';
import * as GameEngine from 'utils/gameEngine';
import * as SocketActions from 'store/ducks/socketModule';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import * as jsUtil from 'utils/jsUtils';

import {ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

class GameResultModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open,
        }
    }

    render() {
        let metaTags = [];

        if (this.props.user.loggedIn) {
            metaTags = [
                {property: 'og:image', content: jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId },
                {property: 'twitter:image', content: jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId },
                {property: 'og:image:secure_url', content: jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId }
            ];
        }


        return (
            <Modal show={this.state.open} className="game-result">
                <Helmet { ...metaTags } />
                <Modal.Header>
                    <Modal.Title>
                        Game completed!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col col-xs-12">
                            { this.renderPlayers() }
                        </div>
                        <div className="col col-xs-12">
                            { this.renderUserLevel() }
                        </div>
                        <div className="col col-xs-12">
                            { this.renderShareButtons() }
                        </div>
                        <div className="col col-xs-12">
                            { this.renderStats() }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    { this.renderButtons() }
                </Modal.Footer>
            </Modal>
        );
    }

    handleRestart() {
        GameEngine.resetGame();
        this.props.dispatch(SocketActions.joinRoom(this.props.game.online));
    }

    handleCloseModal() {
        let state = this.state;
        state.open = false;
        this.setState(state);
    }


    renderShareButtons() {
        const {
            FacebookShareButton,
            TwitterShareButton,
            VKShareButton,
        } = ShareButtons;

        let title = `I finished ${ this.props.game.online ? "an online" : "a practice" } race with ${ this.props.game.wpm } words per minute!`;
        let description = `Beat my score on typitap.com`;

        let url = "https://typitap.com/u/" + this.props.user.data.Username;
        if (!this.props.user.loggedIn) {
            url = "https://typitap.com/";
        }

        // let url = "https://typitap.com/u/" + this.props.user.data.Username;
        let image = jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId;
        // let image = "https://typitap.com/resultboards/15309c4f-5e13-4168-85b0-8ab17721c5aa";

        return (
            <div className="game-result__share">
                <FacebookShareButton className="btn btn-sm btn-facebook" title={ title } description={ description } picture={ image } url={ url } children="Share on Facebook" />
                <TwitterShareButton className="btn btn-sm btn-twitter" title={ title } via="https://typitap.com" url={ url } children="Share on Twitter" />
            </div>
        );

    }


    renderPlayers() {
        if (this.props.game.online) {
            let players = this.props.game.room.players;

            let sortedPlayers = Object.keys(players).sort((a, b) => {
                if (players[a].place === "0") { return true; }
                if (players[b].place === "0") { return false; }
                return players[a].place >= players[b].place;
            });

            let playersList =  sortedPlayers.map((playerId, i) => {
                let player = players[playerId];
                return <div className="game-result__players__player" key={`player-${playerId}`}>
                    { (i + 1) <= 3 ?  <i className={`fa fa-trophy place-${ i + 1 }`}></i> : <i className={`fa`}></i>}
                    <div>{i + 1}. </div>
                    { player.place !== undefined && player.place > 0 ? player.identifier : player.left ? (<span className='text-muted'>Player left</span>) : (<i className="fa fa-spinner fa-spin"></i>)}
                </div>
            });
            return <div className="game-result__players">{ playersList }</div>;
        }

        return "";
    }

    renderUserLevel() {
        if (this.props.user.loggedIn) {
            return <UserLevel level={ this.props.user.data.Level } exp={ this.props.user.data.Exp } next={ this.props.user.data.NextExp } levelName={ this.props.user.data.LevelName } points={ this.props.game.points } />
        } else {
            return <div className="text-muted margin-top-2 margin-bottom-2 text-center"><Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to start recording your game results</div>
        }

    }

    renderStats() {
        return <div className="game-result__stats">
            <div className="pull-left">
                <StatsBadge key={ `result-wpm` } type="wpm" label="wpm"
                            value={ this.props.game.wpm }/>
                <StatsBadge key={ `result-accuracy` } type="accuracy" label="accuracy"
                            value={ this.props.game.accuracy + "%" }/>
            </div>
            <div className="pull-right">
                <StatsBadge key={ `result-time` } type="time"
                            value={ GameUtils.formatTime(this.props.game.time) }/>
                <StatsBadge key={ `result-mistakes` } type="mistakes"
                            value={ Object.keys(this.props.game.mistakes).length }/>
            </div>
        </div>
    }

    renderButtons() {
        return (
            <div>
                <div className="row">
                    <div className="col col-xs-12 col-sm-4 col-sm-offset-2">
                        <button onClick={ this.handleRestart.bind(this) } className="btn btn-secondary btn-round btn-block">Start again</button>
                    </div>
                    <div className="col col-xs-12 col-sm-4">
                        <button className="btn btn-default btn-round btn-block" onClick={ () => { this.props.dispatch(push("/play")) } }>Back to lobby</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="text-center margin-top-2">
                            <button onClick={ this.handleCloseModal.bind(this) } className="btn btn-link">Close window</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        game: state.game,
    }
};

export default connect(mapStateToProps)(GameResultModal);