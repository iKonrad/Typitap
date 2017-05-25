import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import ActivityFeed from 'components/app/ActivityFeed';
import ProgressChart from './components/ProgressChart';
import RecentGames from 'components/user/RecentGames';
import * as DashboardActions from 'store/modules/dashboardModule';
import Follow from 'components/user/UserFollow';
import * as UserActions from 'store/modules/userModule';
class Dashboard extends Component {

    componentWillMount() {
        this.props.dispatch(DashboardActions.getRecentGames(0));
        this.props.dispatch(UserActions.fetchFollowData());

        if (this.props.user.data !== undefined && this.props.user.stats === undefined || Object.keys(this.props.user.stats).length === 0) {
            this.props.dispatch(UserActions.fetchUserStats());
        }

    }

    componentWillUnmount() {
        this.props.dispatch(DashboardActions.resetRecentGames());
    }


    render() {
        return (
            <div className="container profile-page">
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <ProfileInfo user={ this.props.user.data } stats={ this.props.user.stats } isDashboard={true} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <UserStats stats={ this.props.user.stats }/>
                            </div>
                        </div>
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
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Followers" items={ this.props.user !== undefined && this.props.user.follow !== undefined ? this.props.user.follow.followers : [] }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following" items={ this.props.user !== undefined && this.props.user.follow !== undefined ? this.props.user.follow.following : [] }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <RecentGames games={this.props.dashboard.games}/>
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
        user: state.user,
        dashboard: state.dashboard,
    }
};

export default connect(mapStateToProps)(Dashboard);