import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as FormActions from 'store/ducks/formModule';
import Input from 'components/form/fields/Input';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Notifications from 'utils/notifications';
import Helmet from 'react-helmet';
import Card from 'components/app/Card';

class PasswordResetForm extends Component {

    handleSubmitForm(values) {
        return FormActions.submitPasswordReset(values).then((details) => {
            this.props.dispatch(Notifications.success("Your password has been reset. You can now log in using your new credentials"));
        }).then(() => {
            this.props.dispatch(push("/login"));
        });
    };

    componentDidMount(props) {

        this.props.change("token", this.props.token);
    }

    renderForm() {
        const { handleSubmit, pristine, reset, submitting, error, token } = this.props;

        return (
            <div className="">
                <Card loaded={true}>
                    <Helmet title="Password reset" />
                    {error && <strong>{error}</strong>}
                    <div className="card-login">
                        <h3 className="card-title">Reset your password</h3>
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>

                            <Field name="token" component="hidden" type="hidden" />
                            <Field name="password" component={ Input } type="password" label="Password"/>
                            <Field name="password-confirm" component={ Input } type="password" label="Confirm Password"/>
                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </Card>

            </div>
        );
    }


    renderTokenInvalid() {
        return (
            <div className="mt-5">
                <Card loaded={true} title="Ooops">
                    Your token is invalid. Please use the <Link to="/auth/password/forgot">forgot password</Link> feature again.
                </Card>
            </div>
        );
    }


    render() {

        if (this.props.isValid) {
            return this.renderForm();
        } else {
            return this.renderTokenInvalid();
        }
    }

}

export default reduxForm({
    form: 'passwordReset', // a unique name for this form
})(PasswordResetForm);