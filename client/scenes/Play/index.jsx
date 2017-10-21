/*
 Play scene
 Displays the dashboard for the online game
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import * as PlayActions from './ducks/playModule';
import * as AppActions from 'store/ducks/appModule';
import TopChart from 'components/app/TopChart';
import Panel from 'components/app/Panel';
import ActivityFeed from 'components/app/ActivityFeed';
import {resolveAll} from 'utils/jsUtils';
import UserSearch from 'components/app/UserSearch';
import TutorialModal from 'components/game/TutorialModal';
import * as gaUtils from 'utils/gaUtils';
import { Timeline } from 'react-twitter-widgets'
import * as SocketActions from "#app/store/ducks/socketModule";
import * as GameEngine from "#app/utils/gameEngine";
import Helmet from 'react-helmet';

class Play extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showTutorial: false,
        }
    }


    static clientInit({store, nextState, replaceState, callback}) {
        resolveAll([
            store.dispatch(AppActions.fetchChartsData()),
            store.dispatch(PlayActions.fetchGlobalFeed())
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
                <button className="btn btn-outline btn-success btn-block"
                        onClick={this.handleOnlineButton.bind(this)}>Leave online room</button>
            );
        }
        return (
            <button className="btn btn-success btn-block" onClick={this.handleOnlineButton.bind(this)}>Join online
                race</button>
        );
    }

    renderOfflineButton() {
        return (
            <button type="button" className="btn btn-default btn-block"
                    onClick={this.handleOfflineButton.bind(this)}>Practice
            </button>
        );
    }

    getMetaTags() {
        return  {
            title: "Play online race",
        }
    }

    render() {

        return (
            <div className="page-play">
                <Helmet { ...this.getMetaTags() } />
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12 col-md-8">
                            <h1 style={{fontSize: "28px"}}>Play online race or practice your typing skills</h1>
                        </div>
                        <div className="col col-xs-12 col-md-8">
                            <Panel title="Search for players" loaded={true}><UserSearch/></Panel>
                            <Panel title="Recent news" bodyClass=""
                                   loaded={this.props.play.feed !== undefined}><ActivityFeed
                                feed={this.props.play.feed}/></Panel>
                        </div>
                        <div className="col col-xs-12 col-md-4">
                            {this.renderOnlineButton()}
                            {this.renderOfflineButton()}
                            <div className="text-center margin-top-2">
                                <button type="button" className="btn btn-link"
                                        onClick={this.openTutorial.bind(this)}>How to play?
                                </button>
                            </div>

                            <TutorialModal open={this.state.showTutorial} closeModal={this.closeTutorial.bind(this)}/>
                            <TopChart name="today" title="Best today"/>

                            <div className="margin-top-5">
                                <Timeline
                                    dataSource={{
                                        sourceType: 'profile',
                                        screenName: 'typitap'
                                    }}
                                    options={{
                                        username: 'Typitap',
                                        height: '600'
                                    }}
                                    onLoad={() => {}}
                                />
                            </div>


                            <TopChart name="month" title="Best of the month"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        play: state.play,
        game: state.game,
    }
};

export default connect(mapStateToProps)(Play)