import React, {Component} from 'react';
import Gravatar from 'components/user/Gravatar';
import TimeAgo from 'components/app/TimeAgo';
import {Link} from 'react-router';
import FollowButton from 'components/user/FollowButton';
import UserLevel from 'components/user/levels/UserLevel';

class ProfileInfo extends Component {

    renderButton() {
        return <FollowButton id={this.props.isDashboard ? "" : this.props.user.Id}/>
    }

    renderAnonMessage() {
        return <p><Link to="/login">Log in</Link> to follow</p>;
    }


    render() {

        return (


                <div className="section section--pattern">
                    <div className="container">
                        <div className="row">
                            <div className="col profile-page__wrapper">
                                <div className="row">
                                    <div className="col-12 col-md-3">
                                        <div className="profile-page__picture">
                                            <Gravatar email={this.props.user.Email} size={150} className="img-circle"/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-9 col-lg-6 profile-page__info__details">
                                        <h3 className="profile-page__info__name">{this.props.user.Name}</h3>
                                        <p className="profile-page__info__username">#{this.props.user.Username}</p>
                                        <UserLevel level={this.props.user.Level} exp={this.props.user.Exp} next={this.props.user.NextExp}
                                                   levelName={this.props.user.LevelName}/>
                                    </div>
                                    <div className="col-12 col-lg-3 col-md-offset-1 profile-page__info__details--right">
                                        <div style={{
                                            marginBottom: "10px",
                                            marginTop: "-10px"
                                        }}>{this.props.loggedIn || this.props.isDashboard ? this.renderButton() : this.renderAnonMessage()}</div>
                                        <p>Joined: <TimeAgo date={this.props.user.Created}/></p>
                                        <p><strong>{this.props.stats !== undefined ? this.props.stats.gamesPlayed : "-"} </strong>
                                            games played</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
        );
    }
}


export default ProfileInfo;