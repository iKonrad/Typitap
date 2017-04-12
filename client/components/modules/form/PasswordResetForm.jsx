import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FormActions from 'actions/formActions';
import UserActions from 'actions/userActions';
import Input from './fields/Input';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
class PasswordResetForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isTokenValid: false,
            isLoading: true,
        };
    }


    componentWillMount() {

        this.validateToken(this.props.token);
    }

    handleSubmitForm(values) {
        return FormActions.submitPasswordReset(values).then((details) => {
            this.props.dispatch(Notifications.success({'message': `Your password has been reset. You can now log in using your new credentials`}));
        }).then(() => {
            this.props.dispatch(push("/login"));
        });
    };

    validateToken(token) {
        let that = this;
        FormActions.validateToken(token).then((isValid) => {
            let state = this.state;
            state.isTokenValid = isValid;
            state.isLoading = false;
            this.setState(state);
            this.props.change("token", that.props.token);
        });
    }


    renderForm() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div className="panel panel-default card-login">
                <div className="panel-heading"><h2>Reset your password</h2></div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                        <Field name="token" component="hidden" type="hidden" />
                        <Field name="password" component={ Input } type="password" label="Password"/>
                        <Field name="password-confirm" component={ Input } type="password" label="Confirm Password"/>
                        <div className="form-group">
                            <button type="submit" disabled={pristine || submitting} className="btn btn-secondary btn-block">Reset Password</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="panel panel-default card-login">
                <div className="panel-heading"><h2>Loading...</h2></div>
                <div className="panel-body">
                    We are verifying your token. This shouldn't take long
                </div>
            </div>
        );
    }

    renderTokenInvalid() {
        return (
            <div className="panel panel-default card-login">
                <div className="panel-heading"><h2>Ooops</h2></div>
                <div className="panel-body">
                    Your token is invalid. Please use the <Link to="/password/forgot">forgot password</Link> feature again.
                </div>
            </div>
        );
    }


    render() {

        if (this.state.isTokenValid) {
            return this.renderForm();
        } else if (this.state.isLoading) {
            return this.renderLoading();
        } else {
            return this.renderTokenInvalid();
        }
    }

}

export default reduxForm({
    form: 'passwordReset', // a unique name for this form
})(PasswordResetForm);