import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {push} from 'react-router-redux';
import { Link } from 'react-router';
import Input from 'components/form/fields/Input';
import * as FormActions from 'store/modules/formModule';
import * as UserActions from 'store/modules/userModule';
import Notifications from 'react-notification-system-redux';
import * as socketActions from "store/modules/socketModule";
import { connect } from 'react-redux';

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
                this.props.dispatch(Notifications.success({
                    'message': `We have sent you an e-mail with activation link to activate your account`,
                    'title': 'Account created'
                }));
                this.props.dispatch(socketActions.reconnect());
                this.props.dispatch(push("/"));
            }
        });
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return (

            <div className="">
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