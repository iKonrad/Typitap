import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import * as FormActions from 'store/ducks/formModule';
import Input from 'components/form/fields/Input';
import { Link } from 'react-router';
import Notifications from 'utils/notifications';
import Helmet from 'react-helmet';

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
                <Helmet title="Forgot password" />
                <div className="panel panel-default card-login">
                    <div className="panel-heading">
                        <h3>Forgot password</h3>
                    </div>
                    <div className="panel-body">
                        <p>Provide your e-mail address and we'll send you a link to reset your password</p>
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="email" component={ Input } type="email" label="E-mail"/>
                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Reset Password</button>
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

export default reduxForm({
    form: 'passwordForgot', // a unique name for this form
})(PasswordForgotForm);