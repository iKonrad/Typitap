import React from 'react';
import {connect} from 'react-redux';
import Notifications from 'utils/notifications';

class ResendLink extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linkResent: false,
            loading: false,
        }

    }

    handleResendLink() {
        if (this.state.linkResent || this.state.loading) {
            return;
        }

        let that = this;
        let state = that.state;
        state.loading = true;
        this.setState(state);


        fetch(`/api/user/account/resend`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            let state = that.state;
            state.loading = false;
            if (response.success) {
                state.linkResent = true;
                that.props.dispatch(Notifications.accountCreated());
            } else {
                that.props.dispatch(Notifications.error(response.message));
            }
            this.setState(state);
        });
    }

    renderLink() {
        if (!this.state.linkResent) {
            if (!this.state.loading) {
                return <button className="btn btn-link" onClick={ this.handleResendLink.bind(this) }>Resend link</button>
            } else {
                return "Loading...";
            }
        } else {
            return <span>Link sent!</span>
        }
    }


    render() {
        return (
            <span>
                { this.renderLink() }
            </span>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(ResendLink);