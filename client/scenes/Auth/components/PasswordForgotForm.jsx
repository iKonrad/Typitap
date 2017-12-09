import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import * as FormActions from 'store/ducks/formModule';
import Input from 'components/form/fields/Input';
import { Link } from 'react-router';
import Notifications from 'utils/notifications';
import Helmet from 'react-helmet';
import Card from 'components/app/Card';

class PasswordForgotForm extends Component {


    handleSubmitForm(values) {
        return FormActions.submitForgot(values).then((details) => {
            this.props.dispatch(Notifications.success("We have sent you an e-mail with further instructions on how to reset your password"));
            this.props.dispatch(reset("passwordForgot"));
        });
    };

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div className="">
                <Card loaded={true}>
                    <Helmet title="Forgot password" />
                    <div className="card-login">
                        <h3 className="card-title">Forgot password</h3>
                        <h5 className="card-subtitle mb-3">Provide your e-mail address and we'll send you a link to reset your password</h5>
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="email" component={ Input } type="email" label="E-mail"/>
                            <div className="form-group row">
                                <div className="col">
                                    <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Reset Password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Card>
                <div className="row auth__links">
                    <div className="col">
                        <div className="text-left">
                            <Link className="btn btn-link btn-white btn-primary btn-block" to="/login">Log in</Link>
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

export default reduxForm({
    form: 'passwordForgot', // a unique name for this form
})(PasswordForgotForm);