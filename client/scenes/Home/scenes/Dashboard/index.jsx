import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from './components/ProfileInfo';
import QuickLinks from './components/QuickLinks';
import UserStats from './components/UserStats';
import RecentActivity from './components/RecentActivity';
import ProgressChart from './components/ProgressChart';
import RecentGames from './components/RecentGames';
import * as DashboardActions from 'store/modules/dashboardModule';


class Dashboard extends Component {

    componentWillMount() {
        this.props.dispatch(DashboardActions.getRecentGames());
    }

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    static initialize(response, params, store) {
        return store.dispatch(DashboardActions.getRecentGames());
    }

    render() {
        return (
            <div className="container profile-page">
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <ProfileInfo/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <UserStats />
                            </div>
                        </div>

                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <QuickLinks/>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col-xs-12">
                                <RecentActivity />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <ProgressChart/>
                            </div>
                        </div>
                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <RecentGames/>
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

export default connect(mapStateToProps)(Dashboard);