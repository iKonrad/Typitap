import React, {Component} from 'react'
import { Link } from 'react-router';
import {connect} from 'react-redux';
import * as UserActions from 'store/ducks/userModule';

class Activate extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        if (nextState.app.response.success) {
            store.dispatch(UserActions.activateUser());
        }
        callback();
    }

    renderSuccessMessage() {
        return (
            <div>
                <p>Your account has been activated. You can now log in using your login and password.</p>
                <Link to="/login" className="btn btn-link text-center btn-block">{ this.props.user.loggedIn ? "Go to dashboard" : "Log in" }</Link>
            </div>
        );
    }

    renderErrorMessage() {
        return this.props.app.response.error ? this.props.app.response.error : "An error occurred while fetching your token.";
    }


    render() {
        let response = this.props.app.response;
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <div className="panel panel-default card-login">
                            <div className="panel-heading"><h2>Account activation</h2></div>
                            <div className="panel-body">
                                { response.success ? this.renderSuccessMessage() : this.renderErrorMessage() }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

let mapStateToProps = (state) => {
    return {
        user: state.user,
        app: state.app,
    };
};

export default connect(mapStateToProps)(Activate);

