import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import * as FormActions from 'store/modules/formModule';
import Input from 'components/form/fields/Input';
import Notifications from 'react-notification-system-redux';
import { Link } from 'react-router';
class PasswordForgotForm extends Component {


    handleSubmitForm(values) {
        return FormActions.submitForgot(values).then((details) => {
            this.props.dispatch(Notifications.success({'message': `We have sent you an e-mail with further instructions on how to reset your password`, title: "E-mail sent"}));
            this.props.dispatch(reset("passwordForgot"));
        });
    };

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div className="">
                <div className="panel panel-default card-login">
                    <div className="panel-heading">
                        <h2>Forgot password</h2>
                    </div>
                    <div className="panel-body">
                        <p>Provide your e-mail address and we'll send you a link to reset your password</p>
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="email" component={ Input } type="email" label="E-mail"/>
                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-secondary btn-block">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-center">
                    <Link to="/signup">Create account</Link> | <Link to="/login">Log in</Link>
                </div>
            </div>
        );
    }

}

export default reduxForm({
    form: 'passwordForgot', // a unique name for this form
})(PasswordForgotForm);