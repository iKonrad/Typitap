/*
 Play scene
 Displays the dashboard for the online game
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as AppActions from 'store/ducks/appModule';
import * as LobbyActions from './ducks/lobbyModule';
import TopChart from 'components/app/TopChart';
import Card from 'components/app/Card';
import ActivityFeed from 'components/app/ActivityFeed';
import {resolveAll} from 'utils/jsUtils';
import UserSearch from 'components/app/UserSearch';
import * as gaUtils from 'utils/gaUtils';
import * as SocketActions from "#app/store/ducks/socketModule";
import * as GameEngine from "#app/utils/gameEngine";
import Helmet from 'react-helmet';
import LanguageSwitcher from './components/LanguageSwitcher'
import SocialCard from 'components/app/SocialCard';
import WhySignUpSection from 'components/sections/WhySignUpSection';

class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showTutorial: false,
        }
    }

    static clientInit({store, nextState, replaceState, callback}) {
        resolveAll([
            store.dispatch(AppActions.fetchChartsData()),
            store.dispatch(LobbyActions.fetchGlobalFeed())
        ], callback);
    }

    handleOnlineButton() {
        GameEngine.resetGame();
        this.props.dispatch(AppActions.openOnlineSidebar());
        if (this.props.game.room === undefined || this.props.game.room.id === "") {
            this.props.dispatch(SocketActions.joinRoom(true));
        }
    }

    handleOfflineButton() {
        GameEngine.resetGame();
        this.props.dispatch(AppActions.closeOnlineSidebar());
        this.props.dispatch(SocketActions.joinRoom(false));
    }

    openTutorial() {
        gaUtils.logEvent("Play", "View tutorial");
        let state = this.state;
        state.showTutorial = true;
        this.setState(state);
    }

    closeTutorial() {
        let state = this.state;
        state.showTutorial = false;
        this.setState(state);
    }

    renderOnlineButton() {
        if (this.props.game.room !== undefined && this.props.game.room.id !== "" && this.props.game.online) {
            return (
                <button className="btn btn-default btn-block"
                        onClick={this.handleOnlineButton.bind(this)}>Leave online room</button>
            );
        }
        return (
            <button className="btn btn-secondary btn-block" onClick={this.handleOnlineButton.bind(this)}>Join online
                race</button>
        );
    }

    renderOfflineButton() {
        return (
            <button type="button" className="btn btn-white btn-outline btn-block"
                    onClick={this.handleOfflineButton.bind(this)}>Practice alone
            </button>
        );
    }


    getMetaTags() {
        return {
            title: "Play online race",
        }
    }

    render() {
        return (
            <div className="page-play">
                <div className="section section--pattern">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="white">Join the race</h1>
                                <p className="white">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut,
                                    tempore!</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-8 col-lg-6">
                                <div className="row">
                                    <div className="col-12 col-sm-6 mt-2">
                                        {this.renderOnlineButton()}
                                    </div>
                                    <div className="col-12 col-sm-6 mt-2">
                                        {this.renderOfflineButton()}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <LanguageSwitcher/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Helmet {...this.getMetaTags()} />
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-8 mb-4">
                            <Card title="Recent news" subtitle="Recently completed games and achievements"
                                  bodyClass="card-bi"
                                  loaded={this.props.lobby.feed !== undefined}><ActivityFeed
                                feed={this.props.lobby.feed}/></Card>
                        </div>
                        <div className="col-12 col-lg-4 mb-4">
                            <UserSearch/>
                            <TopChart name="today" title="Best today"/>
                            <SocialCard/>

                            <TopChart name="month" title="Best of the month"/>
                        </div>
                    </div>
                </div>
                { this.props.user.loggedIn ? "" : <div className="section section--pattern"><WhySignUpSection/></div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        lobby: state.lobby,
        game: state.game,
    }
};

export default connect(mapStateToProps)(Lobby)