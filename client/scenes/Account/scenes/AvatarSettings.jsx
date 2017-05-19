import React, {Component} from 'react';
import {connect} from 'react-redux';
import Gravatar from 'components/user/Gravatar';

class AvatarSettings extends Component {

    render() {
        return (
            <div className="avatar-page">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3>Update Avatar</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="text-center">
                                We use <strong>Gravatar</strong> to display your avatar. <a href="https://en.gravatar.com/support/what-is-gravatar/" className="text-secondary" target="_blank">What is it?</a>
                                <p>You can update you avatar by logging in under the link below using your <strong>typitap e-mail address</strong>.</p>
                                <Gravatar email={ this.props.user !== undefined ? this.props.user.data.Email : "test@test.com" } size={120} className="img-circle" />
                                <div style={{marginTop: "20px", marginBottom: "20px"}}><a target="_blank" href="https://en.gravatar.com/emails/" className="btn btn-outline btn-sm">Change your avatar</a></div>
                                <p>If you don't see updated avatar, make sure to clear your browser cache.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps)(AvatarSettings);