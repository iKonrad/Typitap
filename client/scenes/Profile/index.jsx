import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as ProfileActions from 'store/ducks/profileModule';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import RecentGames from 'components/user/RecentGames';
import Follow from 'components/user/UserFollow';
import {push} from 'react-router-redux';
import Panel from 'components/app/Panel';

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
                    this.props.dispatch(push("/"));
                }
            })
        ];
    }

    componentWillUnmount() {
        this.props.dispatch(ProfileActions.resetUserProfile());
    }


    render() {
        return (
            <div className="container profile-page">
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <ProfileInfo loggedIn={ this.props.user.loggedIn } user={  this.props.profile.user  }
                                             stats={ this.props.profile.stats }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Panel loaded={ this.props.profile.stats !== undefined }><UserStats
                                    stats={ this.props.profile.stats }/></Panel>
                            </div>
                        </div>

                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Followers" items={ this.props.profile.follow.followers }/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following" items={ this.props.profile.follow.following }/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col-xs-12">
                                Comments section
                            </div>
                        </div>
                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <Panel title="Recent games" loaded={ this.props.profile.games !== undefined }><RecentGames
                            games={ this.props.profile.games } hideButton={true}/></Panel>
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