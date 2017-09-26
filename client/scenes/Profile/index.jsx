import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as ProfileActions from 'store/ducks/profileModule';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import RecentGames from 'components/user/RecentGames';
import Follow from 'components/user/UserFollow';
import {push} from 'react-router-redux';
import Panel from 'components/app/Panel';
import UserBio from 'components/user/UserBio';
import Comments from 'components/app/Comments';
import Helmet from 'react-helmet';
import * as jsUtils from 'utils/jsUtils';

class Profile extends Component {

    static clientInit({store, nextState, replaceState, callback}) {

        if (store.getState().user.loggedIn && (store.getState().user.data.Username === nextState.params.user)) {
            store.dispatch(push("/"));
        } else {
            store.dispatch(ProfileActions.resetUserProfile());
            store.dispatch(ProfileActions.fetchUserProfile(nextState.params.user))
        }
        callback();
    }

    // Runs after side-server rendering
    static serverInit(response, params, store) {
        return [
            store.dispatch(ProfileActions.fetchUserProfile(params.user)).then(() => {
                if (store.getState().user.loggedIn && (store.getState().user.data.Username === params.user)) {
                    store.dispatch(push("/"));
                }
            })
        ];
    }

    turnCommentsPage(page) {
        this.props.dispatch(ProfileActions.turnCommentsPage(page))
    }

    renderMetaTags() {
        if (this.props.router.params.resultId !== undefined) {
            return [
                {
                    property: "og:image",
                    content: jsUtils.getBaseUrl(true) + "resultboards/" + this.props.router.params.resultId,
                },
                {
                    property: "og:image:secure_url",
                    content: jsUtils.getBaseUrl() + "resultboards/" + this.props.router.params.resultId,
                },
                {
                    property: "og:url",
                    content: jsUtils.getBaseUrl() + "u/" + this.props.router.params.user + "/" + this.props.router.params.resultId,
                },
                {
                    property: "twitter:image",
                    content: jsUtils.getBaseUrl() + "resultboards/" + this.props.router.params.resultId,
                },
            ];
        }

        return [];
    }

    render() {
        return (
            <div className="container profile-page">
                <Helmet title={this.props.user.data.Username} {...this.renderMetaTags()} />
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel className="profile-page__info" loaded={this.props.profile.user !== undefined}>
                                    <ProfileInfo loggedIn={this.props.user.loggedIn}
                                                 user={this.props.profile.user}
                                                 stats={this.props.profile.stats}/>
                                </Panel>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel loaded={this.props.profile.stats !== undefined}><UserStats
                                    stats={this.props.profile.stats}/></Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel
                                    title={`Comments (${ this.props.profile.comments !== undefined ? this.props.profile.comments.length : 0 })`}
                                    loaded={true}>
                                    <Comments
                                        comments={this.props.profile.comments}
                                        id={this.props.profile.user.Id}
                                        page={this.props.profile.commentsPage}
                                        onPageChange={this.turnCommentsPage.bind(this)}
                                    />
                                </Panel>
                            </div>
                        </div>
                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel title="About" loaded={this.props.profile.user !== undefined}>
                                    <UserBio user={this.props.profile.user}/>
                                </Panel>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Followers" items={this.props.profile.follow.followers}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following" items={this.props.profile.follow.following}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel title="Recent games" loaded={this.props.profile.games !== undefined}>
                                    <RecentGames
                                        games={this.props.profile.games}
                                        hideButton={true}
                                    />
                                </Panel>
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
        app: state.app,
        routing: state.routing,
        user: state.user,
        profile: state.profile,
    };
};

export default connect(mapStateToProps)(Profile);