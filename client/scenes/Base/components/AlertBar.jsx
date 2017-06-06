import React, {Component} from 'react';
import {connect} from 'react-redux';
import Alert from './Alert';
import ResendLink from './ResendLink';

class AlertBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            linkResent: false,
        }
    }

    render() {
        return (
            <div>
                { this.renderInactiveUserAlert() }
            </div>
        );
    }

    renderInactiveUserAlert() {
        if (this.props.user.loggedIn && !this.props.user.data.Active) {
            return <Alert type="warning">Your account is not active. You need to click on the activation link in order to gain access to all features. <ResendLink/> </Alert>;
        } else {
            return "";
        }
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(AlertBar);