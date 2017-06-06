import React, {Component} from 'react'
import { Link } from 'react-router';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import Notifications from 'utils/notifications';


class EmailChange extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    componentDidMount() {
        if (this.props.app.response !== undefined && this.props.app.response.success) {
            this.props.dispatch(Notifications.success("Your e-mail has been updated"));
            this.props.dispatch(push("/account"));
        }
    }

    renderSuccessMessage() {
        return (
            <div>
                <p>Your email has been updated.</p>
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
                            <div className="panel-heading"><h2>E-mail change</h2></div>
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

export default connect(mapStateToProps)(EmailChange);

