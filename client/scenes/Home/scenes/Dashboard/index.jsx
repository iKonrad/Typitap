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
import * as ProfileActions from 'store/ducks/profileModule';
import Panel from 'components/app/Panel';
import { resolveAll } from 'utils/jsUtils';
import UserboardSnippet from 'components/user/UserboardSnippet';
import Comments from 'components/app/Comments';

class Dashboard extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        console.log("???");
        resolveAll([
            store.dispatch(DashboardActions.fetchActivityFeed(0)),
            store.dispatch(ProfileActions.fetchUserProfile(store.getState().user.data.Username)),
        ], callback);
    }

    componentWillUnmount() {
        this.props.dispatch(DashboardActions.resetActivityFeed());
        this.props.dispatch(ProfileActions.resetUserProfile());
    }

    handleFetchMoreRecentGames() {
        let offset = this.props.dashboard.games.length;
        this.props.dispatch(DashboardActions.getRecentGames(offset));
    }

    turnCommentsPage(page) {
        this.props.dispatch(ProfileActions.turnCommentsPage(page))
    }

    render() {
        return (
            <div className="container profile-page">
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel className="profile-page__info" loaded={ this.props.profile.user !== undefined && this.props.profile.stats }>
                                    <ProfileInfo user={ this.props.profile.user } stats={ this.props.profile.stats }
                                                 isDashboard={true}/>
                                </Panel>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel loaded={ this.props.profile.stats !== undefined }><UserStats
                                    stats={ this.props.profile.stats }/></Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Panel title="Activity feed" bodyClass="" loaded={ this.props.dashboard.feed !== undefined }><ActivityFeed
                                    feed={ this.props.dashboard.feed }/></Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Panel title="Your userboard" loaded={ this.props.user !== undefined && this.props.user.data !== undefined }>
                                    <UserboardSnippet user={ this.props.user.data } />
                                </Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Panel title={ `Comments (${ this.props.profile.comments !== undefined ? this.props.profile.comments.length : 0 })` } loaded={ true }>
                                    <Comments
                                        comments={ this.props.profile.comments }
                                        id={ this.props.user.data.Id }
                                        page={ this.props.profile.commentsPage }
                                        onPageChange={ this.turnCommentsPage.bind(this) }
                                    />
                                </Panel>
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
                                        items={ this.props.profile.follow.followers }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following"
                                        items={ this.props.profile.follow.following }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel title="Recent games" bodyClass="" loaded={ this.props.profile.games !== undefined }><RecentGames
                                    onMore={ this.handleFetchMoreRecentGames.bind(this) }
                                    games={ this.props.profile.games }/></Panel>
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
        profile: state.profile,
    }
};

export default connect(mapStateToProps)(Dashboard);