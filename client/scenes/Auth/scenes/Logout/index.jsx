import React, { Component } from "react";
import * as UserActions from 'store/ducks/userModule';
import { connect } from 'react-redux';

import * as socketActions from 'store/ducks/socketModule';
import { push } from 'react-router-redux';
import Notifications from 'utils/notifications';

class Logout extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    componentDidMount(props) {
        return this.props.dispatch(UserActions.logoutUser()).then(() => {
            this.props.dispatch(Notifications.success('You have been logged out'));

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