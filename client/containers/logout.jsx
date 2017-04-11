import React, { Component } from "react";
import { browserHistory } from 'react-router';
import UserActions from 'actions/userActions';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
class Logout extends Component {

    static onEnter({store, next, replace, callback}) {
        store.dispatch(UserActions.logoutUser());
        callback();
    }

    static fetchData({query, params, store}) {
        return store.dispatch(UserActions.logoutUser());
    }

    componentDidMount(props) {
        this.props.dispatch(Notifications.success({'message': 'You have been logged out', 'title': 'Log out'}));
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