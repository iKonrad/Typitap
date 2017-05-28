import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as FormActions from 'store/ducks/formModule';
import * as UserActions from 'store/ducks/userModule';
import Input from 'components/form/fields/Input';
import { Link } from 'react-router';
import { push } from 'react-router-redux'
import Notifications from 'utils/notifications';
import { connect } from 'react-redux';
import * as socketActions from "store/ducks/socketModule";


class LoginForm extends Component {


    handleSubmitForm(values) {


        // Attach identifier to the form so we can reconnect the websocket on login
        if (this.props.socket.connected) {
            values.identifier = this.props.socket.identifier;
        }

        return FormActions.submitLogin(values).then((details) => {
            this.props.dispatch(UserActions.loginUser(details.user));
            this.props.dispatch(Notifications.welcomeBack(details.user.Name));
        }).then(() => {
            this.props.dispatch(socketActions.reconnect());
            this.props.dispatch(push("/"));
        });
    };



    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div>
                <div className="panel panel-default card-login">
                    <div className="panel-heading"><h3>Log in</h3></div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="username" component={ Input } type="text" label="Username"/>
                            <Field name="password" component={ Input } type="password" label="Password"/>
                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Log in</button>
                            </div>
                        </form>
                    </div>
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col col-xs-12">
                                <div className="pull-left">
                                    <Link to="/auth/password/forgot">Forgot password?</Link>
                                </div>
                                <div className="pull-right">
                                    <Link to="/signup">Create account</Link>
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

LoginForm = reduxForm({
    form: 'login', // a unique name for this form
})(LoginForm);

export default LoginForm = connect(mapStateToProps)(LoginForm);