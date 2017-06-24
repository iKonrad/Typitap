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
        this.props.dispatch(push("/play/online"));
    }

    handleOfflineButton() {
        this.props.dispatch(push("/play/offline"));
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

    render() {

        return (
            <div className="page-play">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12 col-md-8">
                            <Panel loaded={true}><UserSearch/></Panel>
                            <Panel title="Recent news" bodyClass=""
                                   loaded={ this.props.play.feed !== undefined }><ActivityFeed
                                feed={ this.props.play.feed }/></Panel>
                        </div>
                        <div className="col col-xs-12 col-md-4">

                            <button type="button" className="btn btn-secondary btn-block"
                                    onClick={ this.handleOnlineButton.bind(this) }>Race online
                            </button>
                            <button type="button" className="btn btn-default btn-block"
                                    onClick={ this.handleOfflineButton.bind(this) }>Practice
                            </button>
                            <div className="text-center margin-top-2">
                                <button type="button" className="btn btn-link" onClick={ this.openTutorial.bind(this) }>How to play?</button>
                            </div>

                            <TutorialModal open={ this.state.showTutorial } closeModal={ this.closeTutorial.bind(this) } />


                            <TopChart name="today" title="Today's bests"/>
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
    }
};

export default connect(mapStateToProps)(Play)