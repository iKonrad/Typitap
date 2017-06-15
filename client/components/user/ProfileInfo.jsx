import React, {Component} from 'react';
import Gravatar from 'components/user/Gravatar';
import TimeAgo from 'components/app/TimeAgo';
import { Link } from 'react-router';
import FollowButton from 'components/user/FollowButton';
import UserLevel from 'components/user/levels/UserLevel';

class ProfileInfo extends Component {

    renderButton() {
        return <FollowButton id={ this.props.isDashboard ? "" : this.props.user.Id } />
    }

    renderAnonMessage() {
        return <p><Link to="/login">Log in</Link> to follow</p>;
    }


    render() {

        return (
            <div className="panel panel-default profile-page__info">
                <div className="panel-body">
                    <div className="row">
                        <div className="col col-xs-12 col-sm-3 col-md-3">
                            <div className="profile-page__picture">
                                <Gravatar email={  this.props.user.Email  } size={120} className="img-circle" />
                            </div>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-md-5 profile-page__info__details">
                            <UserLevel level={ this.props.user.Level } exp={ this.props.user.Exp } next={ this.props.user.NextExp } levelName={ this.props.user.LevelName } />
                            <p className="profile-page__info__name">{ this.props.user.Name }</p>
                            <p className="profile-page__info__username">#{ this.props.user.Username }</p>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-sm-offset-3 col-md-3 col-md-offset-1 profile-page__info__details--right">
                            <div style={{marginBottom: "10px", marginTop: "-10px"}}>{ this.props.loggedIn || this.props.isDashboard ? this.renderButton() : this.renderAnonMessage() }</div>
                            <p>Joined  <TimeAgo date={this.props.user.Created} /></p>
                            <p>Played <strong>{ this.props.stats !== undefined ? this.props.stats.gamesPlayed : "-"  }</strong> games</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default ProfileInfo;