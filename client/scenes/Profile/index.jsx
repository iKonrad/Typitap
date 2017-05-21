import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as AppActions from 'store/modules/appModule';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import RecentGames from 'components/user/RecentGames';
import Follow from 'components/user/UserFollow';
import { push } from 'react-router-redux';

class Profile extends Component {
    // Runs after side-server rendering
    static initialize(response, params, store) {
        return store.dispatch(AppActions.fetchUserProfile(params.user))
    }

    componentWillMount() {
        if (this.props.user.loggedIn && (this.props.user.data.Username === this.props.router.params.user)) {
            this.props.dispatch(push("/"));
        } else {
            this.props.dispatch(AppActions.fetchUserProfile(this.props.router.params.user))
        }


    }

    componentWillReceiveProps(newProps) {
        if (newProps.routing.locationBeforeTransitions.key !== this.props.routing.locationBeforeTransitions.key) {
            if (this.props.user.loggedIn && (this.props.user.data.Username === this.props.router.params.user)) {
                this.props.dispatch(push("/"));
            } else {
                this.props.dispatch(AppActions.fetchUserProfile(this.props.router.params.user))
            }
        }
    }


    render() {
        return (
            <div className="container profile-page">
                <div className="row">
                    <div className="col col-xs-12 col-md-8">
                        <div className="row">
                            <div className="col col-xs-12">
                                <ProfileInfo user={  this.props.app.profile.user  } />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <UserStats stats={ this.props.app.profile.stats } />
                            </div>
                        </div>

                    </div>
                    <div className="col col-xs-12 col-md-4">
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Followers" items={ this.props.app.profile.follow.followers } />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <Follow title="Following" items={ this.props.app.profile.follow.following } />
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
                        <RecentGames games={ this.props.app.profile.games } hideButton={true} />
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
    };
};

export default connect(mapStateToProps)(Profile);