import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import ActivityFeed from 'components/app/ActivityFeed';
import RecentGames from 'components/user/RecentGames';
import UserBio from 'components/user/UserBio';
import * as DashboardActions from './ducks/dashboardModule';
import Follow from 'components/user/UserFollow';
import * as UserActions from 'store/ducks/userModule';
import Panel from 'components/app/Panel';
import { resolveAll } from 'utils/jsUtils';

class Dashboard extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        resolveAll([
            store.dispatch(DashboardActions.getRecentGames(0)),
            store.dispatch(UserActions.fetchFollowData()),
            store.dispatch(DashboardActions.fetchActivityFeed(0)),
            store.dispatch(UserActions.fetchUserStats()),
        ], callback);
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
                                <ProfileInfo user={ this.props.user.data } stats={ this.props.user.stats }
                                             isDashboard={true}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel loaded={ this.props.user.stats !== undefined }><UserStats
                                    stats={ this.props.user.stats }/></Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Panel title="Activity feed" bodyClass="" loaded={ this.props.dashboard.feed !== undefined }><ActivityFeed
                                    feed={ this.props.dashboard.feed }/></Panel>
                            </div>
                        </div>
                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel title="About" loaded={ this.props.user !== undefined && this.props.user.data !== undefined }>
                                    <UserBio user={ this.props.user.data } />
                                </Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Followers"
                                        items={ this.props.user !== undefined && this.props.user.follow !== undefined ? this.props.user.follow.followers : [] }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following"
                                        items={ this.props.user !== undefined && this.props.user.follow !== undefined ? this.props.user.follow.following : [] }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel title="Recent games" bodyClass="" loaded={ this.props.dashboard.games !== undefined }><RecentGames
                                    onMore={ this.handleFetchMoreRecentGames.bind(this) }
                                    games={this.props.dashboard.games}/></Panel>
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