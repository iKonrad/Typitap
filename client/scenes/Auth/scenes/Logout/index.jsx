import React, { Component } from "react";
import { browserHistory } from 'react-router';
import * as UserActions from 'store/modules/userModule';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
import * as socketActions from 'store/modules/socketModule';
class Logout extends Component {

    static onEnter({store, next, replace, callback}) {
        store.dispatch(UserActions.logoutUser());
        callback();
    }

    static initialize({query, params, store}) {
        return store.dispatch(UserActions.logoutUser());
    }

    componentDidMount(props) {
        this.props.dispatch(Notifications.success({'message': 'You have been logged out', 'title': 'Log out'}));
        this.props.dispatch(socketActions.reconnect());
        browserHistory.push('/');
    }

    render() {
        return (<div>You have logged out.</div>);
    }


}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Logout);