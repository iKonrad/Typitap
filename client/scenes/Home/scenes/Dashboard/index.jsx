import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from './components/ProfileInfo';
import QuickLinks from './components/QuickLinks';
import UserStats from './components/UserStats';
import ActivityFeed from 'components/app/ActivityFeed';
import ProgressChart from './components/ProgressChart';
import RecentGames from './components/RecentGames';
import * as DashboardActions from 'store/modules/dashboardModule';


class Dashboard extends Component {

    componentWillMount() {
        this.props.dispatch(DashboardActions.getRecentGames(0));
        this.props.dispatch(DashboardActions.fetchActivityFeed(0));
    }

    componentWillUnmount() {
        this.props.dispatch(DashboardActions.resetRecentGames());
        this.props.dispatch(DashboardActions.resetActivityFeed());
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
                                <ActivityFeed />
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