/*
    Play scene
    Displays the dashboard for the online game
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class Play extends Component {


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
                            <div className="row">
                                <div className="col col-xs-12">
                                    <button type="button" className="btn btn-secondary btn-block" onClick={ this.handleOnlineButton.bind(this) }>Play Online</button>
                                    <button type="button" className="btn btn-default btn-block" onClick={ this.handleOfflineButton.bind(this) }>Play Offline</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col col-xs-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading"><h3>Today best</h3></div>
                                    </div>
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3>TOP January</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
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