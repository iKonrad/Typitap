import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import ActivityFeed from 'components/app/ActivityFeed';
import RecentGames from 'components/user/RecentGames';
import * as DashboardActions from './ducks/dashboardModule';
import Follow from 'components/user/UserFollow';
import * as UserActions from 'store/ducks/userModule';
import Panel from 'components/app/Panel';


class Dashboard extends Component {

    componentWillMount() {
        this.props.dispatch(DashboardActions.getRecentGames(0));
        this.props.dispatch(UserActions.fetchFollowData());
        this.props.dispatch(DashboardActions.fetchActivityFeed(0));

        if (this.props.user.data !== undefined && this.props.user.stats === undefined || Object.keys(this.props.user.stats).length === 0) {
            this.props.dispatch(UserActions.fetchUserStats());
        }

    }

    componentWillUnmount() {
        this.props.dispatch(DashboardActions.resetRecentGames());
        this.props.dispatch(DashboardActions.resetActivityFeed());
    }

    handleFetchMoreRecentGames() {
            let offset = this.props.dashboard.games.length;
            this.props.dispatch(DashboardActions.getRecentGames(offset));
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
                                <Panel loaded={ this.props.user.stats !== undefined }><UserStats stats={ this.props.user.stats }/></Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Panel title="Activity feed" bodyClass=""><ActivityFeed feed={ this.props.dashboard.feed } /></Panel>
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
                                <Panel title="Recent games" bodyClass=""><RecentGames onMore={ this.handleFetchMoreRecentGames.bind(this) } games={this.props.dashboard.games}/></Panel>
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