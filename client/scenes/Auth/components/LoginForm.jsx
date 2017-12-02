import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import * as FormActions from 'store/ducks/formModule';
import * as UserActions from 'store/ducks/userModule';
import Input from 'components/form/fields/Input';
import {Link} from 'react-router';
import {push} from 'react-router-redux'
import Notifications from 'utils/notifications';
import {connect} from 'react-redux';
import * as socketActions from "store/ducks/socketModule";
import Helmet from 'react-helmet';
import Card from 'components/app/Card';

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
            // Check if there's a redirect URL provided
            if (this.props.redirect !== null && this.props.redirect.length > 0) {
                window.location.href = this.props.redirect;
            } else {
                this.props.dispatch(push("/"));
            }
        });
    };

    render() {

        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <div className="">
                <Card loaded={true}>
                    <Helmet title="Log in"/>
                    <div className="card-login">

                        <h3 className="card-title">Log in</h3>
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="username" component={Input} type="text" label="Username"/>
                            <Field name="password" component={Input} type="password" label="Password"/>
                            <div className="row form-group">
                                <div className="col">
                                    <button type="submit" disabled={pristine || submitting}
                                            className="btn btn-primary btn-block">Log in
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Card>
                <div className="row auth__links">
                    <div className="col">
                        <div className="text-left">
                            <Link className="btn btn-link btn-white btn-primary btn-block" to="/auth/password/forgot">Forgot password?</Link>
                        </div>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <Link className="btn btn-link btn-white btn-primary btn-block" to="/signup">Create account</Link>
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
    form: 'login',
})(LoginForm);

export default LoginForm = connect(mapStateToProps)(LoginForm);