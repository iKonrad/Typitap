import React, {Component} from 'react';
import Gravatar from 'components/user/Gravatar';
import NewTime from 'react-timeago';
import { Link } from 'react-router';
import FollowButton from 'components/user/FollowButton';

class ProfileInfo extends Component {


    constructor(props) {
        super(props);

        this.state = {
            created: "",
        }
    }

    componentDidMount() {
        let state = this.state;
        state.created = this.props.user.Created;
        this.setState(state);
    }

    renderJoined () {

        if (this.state.created !== "") {
            // return <TimeAgo datetime={ new Date(this.state.created) } />
            return <NewTime date={this.props.user.Created} minPeriod={4} live={false} />
        }
        return "...";
    }

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
                        <div className="col col-xs-12 col-sm-3 col-md-4 profile-page__info__details">
                            <p className="profile-page__info__name">{ this.props.user.Name }</p>
                            <p className="profile-page__info__username">#{ this.props.user.Username }</p>
                            { this.props.loggedIn || this.props.isDashboard ? this.renderButton() : this.renderAnonMessage() }

                        </div>
                        <div className="col col-xs-12 col-sm-3 col-sm-offset-3 col-md-3 col-md-offset-2 profile-page__info__details--right">
                            <p>Joined  { this.renderJoined() }</p>
                            <p>Played <strong>{ this.props.stats !== undefined ? this.props.stats.gamesPlayed : "-"  }</strong> games</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default ProfileInfo;