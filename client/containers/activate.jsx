import React, { Component } from 'react'
import {  push } from 'react-router-redux';
import { connect } from 'react-redux';
import UserActions from 'actions/userActions';
import Notifications from 'react-notification-system-redux';

class Activate extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }


    componentDidMount(props) {
        return store.dispatch(UserActions.activateUser(this.props.params.token)).then((data) => {
            if (data.success) {
                this.props.dispatch(Notifications.success({message: "You can now log in using your username and password", title: "Account activated"}))
            } else {
                this.props.dispatch(Notifications.error({message: data.message, title: "Error"}))
            }
            this.props.dispatch(push("/login"));
        });
    }

    render() {
        return (<div>Activating...</div>);
    }

}

let mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Activate);


