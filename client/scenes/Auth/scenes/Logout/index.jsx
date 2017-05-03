import React, { Component } from "react";
import * as UserActions from 'store/modules/userModule';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
import * as socketActions from 'store/modules/socketModule';
import { push } from 'react-router-redux';
class Logout extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }



    componentDidMount(props) {
        return this.props.dispatch(UserActions.logoutUser()).then(() => {
            this.props.dispatch(Notifications.success({'message': 'You have been logged out', 'title': 'Log out'}));
            this.props.dispatch(socketActions.reconnect());
            this.props.dispatch(push("/"));
        });
    }

    render() {
        return (<div>Logging out...</div>);
    }


}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Logout);