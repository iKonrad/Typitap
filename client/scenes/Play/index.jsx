/*
    Play scene
    Displays the dashboard for the online game
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as AppActions from 'store/modules/appModule';
import TopChart from 'components/app/TopChart';

class Play extends Component {

    componentWillMount() {
        this.props.dispatch(AppActions.fetchChartsData());
    }

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    static initialize(response, params, store) {
        return store.dispatch(AppActions.fetchChartsData());
    }


    handleOnlineButton() {
        this.props.dispatch(push("/play/online"));
    }

    handleOfflineButton() {
        this.props.dispatch(push("/play/offline"));
    }

    render() {

        return (
            <div className="page-play">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12 col-md-8">
                            <div className="panel panel-default">
                                <div className="panel-heading"><h3>Recent news</h3></div>
                            </div>
                            <div className="panel panel-default">
                                <div className="panel-heading"><h3>Something else here</h3></div>
                            </div>
                        </div>

                        <div className="col col-xs-12 col-md-4">

                                    <button type="button" className="btn btn-secondary btn-block" onClick={ this.handleOnlineButton.bind(this) }>Play Online</button>
                                    <button type="button" className="btn btn-default btn-block" onClick={ this.handleOfflineButton.bind(this) }>Play Offline</button>


                                    <TopChart name="today" title="Today's bests" />
                                    <TopChart name="month" title="Best of the month" />

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Play)