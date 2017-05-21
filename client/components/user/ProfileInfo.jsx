import React, {Component} from 'react';
import Gravatar from 'components/user/Gravatar';

class ProfileInfo extends Component {


    render() {
        return (
            <div className="panel panel-default profile-page__info">
                <div className="panel-body">
                    <div className="row">
                        <div className="col col-xs-12 col-sm-3 col-md-3">
                            <div className="profile__picture">
                                <Gravatar email={  this.props.user.Email  } size={120} className="img-circle img-responsive" />
                            </div>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-md-2 profile-page__info__details">
                            <p className="profile-page__info__name">{ this.props.user.Name }</p>
                            <p className="profile-page__info__username">#{ this.props.user.Username }</p>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-sm-offset-3 col-md-2 col-md-offset-5 profile-page__info__details--right">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default ProfileInfo;