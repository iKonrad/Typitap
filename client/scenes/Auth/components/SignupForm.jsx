import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {push} from 'react-router-redux';
import { Link } from 'react-router';
import Input from 'components/form/fields/Input';
import * as FormActions from 'store/ducks/formModule';
import * as UserActions from 'store/ducks/userModule';
import Notifications from 'utils/notifications';
import * as socketActions from "store/ducks/socketModule";
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class SignupForm extends Component {

    handleSubmitForm(values) {

        // Attach identifier to the form so we can reconnect the websocket on login
        if (this.props.socket.connected) {
            values.identifier = this.props.socket.identifier;
        }

        return FormActions.submitSignup(values).then((details) => {
            this.props.dispatch(UserActions.loginUser(details.user));
            return details;
        }).then((details) => {
            if (details && details.user && details.user.Id) {
                this.props.dispatch(Notifications.accountCreated());
                this.props.dispatch(socketActions.reconnect());
                // Check if there's a redirect URL provided
                if (this.props.redirect !== null && this.props.redirect.length > 0) {
                    window.location.href = this.props.redirect;
                } else {
                    this.props.dispatch(push("/"));
                }
            }
        });
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return (
            <div className="">
                <Helmet title="Sign up" />
                <div className="panel panel-default card-login">
                    <div className="panel-heading"><h3>Sign up</h3></div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>

                            <Field name="username" component={ Input } type="text" label="Username"/>
                            <Field name="email" component={ Input } type="text" label="E-mail"/>
                            <Field name="name" component={ Input } type="text" label="Name"/>
                            <Field name="password" component={ Input } type="password" label="Password"/>

                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting}
                                        className="btn btn-primary btn-block">Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col col-xs-12">
                                <div className="pull-left">
                                    <Link to="/login">Log in</Link>
                                </div>
                                <div className="pull-right">
                                    <Link to="/auth/password/forgot">Forgot password?</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        socket: state.socket
    };
}

SignupForm = reduxForm({
    form: 'signup', // a unique name for this form
})(SignupForm);

export default SignupForm = connect(mapStateToProps)(SignupForm);