import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import UserLevel from 'components/user/levels/UserLevel';
import StatsBadge from 'components/user/UserStatsBadge';
import * as GameUtils from 'utils/gameUtils';
import * as GameEngine from 'utils/gameEngine';
import * as SocketActions from 'store/ducks/socketModule';
import * as AppActions from 'store/ducks/appModule';
import {push} from 'react-router-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';
import * as jsUtil from 'utils/jsUtils';
import Icon from '@fortawesome/react-fontawesome';

import {ShareButtons, ShareCounts, generateShareIcon} from 'react-share';

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
            metaTags = {
                meta: [
                    {property: "og:title", content: "Game finished"},
                    {
                        property: 'og:image',
                        override: true,
                        content: jsUtil.getBaseUrl(true) + "resultboards/" + this.props.game.resultId
                    },
                    {
                        property: 'twitter:image',
                        override: true,
                        content: jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId
                    },
                    {
                        property: 'og:image:secure_url',
                        override: true,
                        content: jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId
                    }
                ]
            };
        }

        return (
            <Modal isOpen={this.state.open} className="game-result">
                <Helmet { ...metaTags } />
                <ModalHeader>
                        Game completed!
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col">
                            { this.renderPlayers() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            { this.renderUserLevel() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            { this.renderStats() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            { this.renderAffiliateProduct() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button className="btn mt-4 btn-primary btn-block" onClick={ this.handleBack.bind(this) }>Back to lobby
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mt-2 text-right">
                                <button onClick={ this.handleCloseModal.bind(this) } className="btn btn-link btn-primary">Close window
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
    
    renderAffiliateProduct() {
        let product = this.props.game.product;
        if (Object.keys(product).length < 1 || product.images === undefined) {
            return <span></span>;
        }
        return (<div className="mt-4 game-result__affiliate">
            <div className="game-result__affiliate__button">
                <a href={ product.url } target="_blank" className="btn btn-sm btn-secondary btn-block">Get on Amazon</a>
            </div>
            <div className="game-result__affiliate__image"><img src={ product.images.SmallImage.URL } alt="" /></div>
            <div className="game-result__affiliate__caption">You've just typed a text from:</div>
            <br />
            <div className="game-result__affiliate__title">{ product.title } { product.source !== undefined ? "(" + product.source + ")" : "" }</div>
        </div>)
    }

    handleBack() {
        this.props.dispatch(push("/"));
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
        } = ShareButtons;

        let title = `I finished ${ this.props.game.online ? "an online" : "a practice" } race with ${ this.props.game.wpm } words per minute!`;
        let description = `Beat my score on typitap.com`;

        let url = jsUtil.getBaseUrl() + "u/" + this.props.user.data.Username + "/" + this.props.game.resultId;
        if (!this.props.user.loggedIn) {
            url = "https://typitap.com";
        }

        // let url = "https://typitap.com/u/" + this.props.user.data.Username;
        let image = jsUtil.getBaseUrl() + "resultboards/" + this.props.game.resultId;
        // let image = "https://typitap.com/resultboards/15309c4f-5e13-4168-85b0-8ab17721c5aa";

        return (
            <div className="game-result__share">
                <FacebookShareButton style={{marginBottom: 0}} className="btn btn-xs btn-facebook" title={ title } quote={ description }
                                     picture={ image } url={ url } children="Share on Facebook"/>
                <TwitterShareButton style={{marginBottom: 0}} className="btn btn-xs btn-twitter" title={ title } via="typitap"
                                    url={ url } children="Share on Twitter"/>
            </div>
        );

    }


    renderPlayers() {
        if (this.props.game.online) {
            let players = this.props.game.room.players;

            let sortedPlayers = Object.keys(players).sort((a, b) => {
                if (players[a].place === "0") {
                    return true;
                }
                if (players[b].place === "0") {
                    return false;
                }
                return players[a].place >= players[b].place;
            });

            let playersList = sortedPlayers.map((playerId, i) => {
                let player = players[playerId];
                return <div className="game-result__players__player" key={`player-${playerId}`}>

                    { (i + 1) <= 3 ? <Icon icon={['fas', 'trophy']} className={`place-${ i + 1}`} /> : ""}

                    <div>{i + 1}.</div>

                    { player.place !== undefined && player.place > 0 ? player.identifier : player.left ? (
                        <span className='text-muted'>Player left</span>) : (<Icon icon={['far', 'spinner-third']} spin />
                    )}

                    { player.place !== undefined && player.place > 0 ? <span className="game-result__players__player__wpm"> ({ player.wpm } wpm)</span> : "" }
                </div>
            });

            return <div className="game-result__players">{ playersList }</div>;
        }

        return "";
    }

    renderUserLevel() {
        if (this.props.user.loggedIn) {
            return <UserLevel level={ this.props.user.data.Level } exp={ this.props.user.data.Exp }
                              next={ this.props.user.data.NextExp } levelName={ this.props.user.data.LevelName }
                              points={ this.props.game.points }/>
        } else {
            return (
                <div className="modal-alert">
                    <Link to="/signup">Create account</Link> or <Link to="/login">log in</Link> to start saving your results
                </div>
            );
        }

    }

    renderWPMMessage(wpm) {
        let wpmMessage = GameEngine.getWPMMessage(wpm);

        if (wpmMessage !== "") {
            return  (
                <div style={{textAlign: "center"}}>
                    <div className="badge badge-success">{ wpmMessage }</div>
                </div>
            );
        }
    }

    renderAccuracyMessage(accuracy) {
        let accuracyMessage = GameEngine.getAccuracyMessage(accuracy);
        if (accuracyMessage !== "") {
            return  (
                <div style={{textAlign: "center"}}>
                    <div className="badge badge-info">{ accuracyMessage }</div>
                </div>
            );
        }
    }

    renderStats() {
        return <div className="game-result__stats">
            <div className="float-left">
                <div style={{display: "inline-block"}}>
                    <StatsBadge key={ `result-wpm` } type="wpm" label="wpm"
                                value={ this.props.game.wpm }/>
                    { this.renderWPMMessage(this.props.game.wpm) }
                </div>
                <div style={{display: "inline-block", verticalAlign: "top"}}>
                    <StatsBadge key={ `result-accuracy` } type="accuracy" label="accuracy"
                                value={ this.props.game.accuracy + "%" }/>
                    { this.renderAccuracyMessage(this.props.game.accuracy) }
                </div>

            </div>
            <div className="float-right">
                <StatsBadge key={ `result-time` } type="stopwatch"
                            value={ GameUtils.formatTime(this.props.game.time) }/>
                <StatsBadge key={ `result-mistakes` } type="bug"
                            value={ Object.keys(this.props.game.mistakes).length }/>
            </div>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        game: state.game,
    }
};

export default connect(mapStateToProps)(GameResultModal);