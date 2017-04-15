import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import Input from 'components/form/fields/Input';
import * as FormActions from 'store/modules/formModule';
import * as UserActions from 'store/modules/userModule';
import Notifications from 'react-notification-system-redux';
class SignupForm extends Component {

    handleSubmitForm(values) {
        return FormActions.submitSignup(values).then((details) => {
            this.props.dispatch(UserActions.loginUser(details.user));
            return details;
        }).then((details) => {
            if (details && details.user && details.user.id) {
                this.props.dispatch(Notifications.success({
                    'message': `We have sent you an e-mail with activation link to activate your account`,
                    'title': 'Account created'
                }));
                browserHistory.push("/");
            }
        });
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return (

            <div className="">
                <div className="panel panel-default card-login">
                    <div className="panel-heading"><h2>Sign up</h2></div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>

                            <Field name="username" component={ Input } type="text" label="Username"/>
                            <Field name="email" component={ Input } type="text" label="E-mail"/>
                            <Field name="name" component={ Input } type="text" label="Name"/>
                            <Field name="password" component={ Input } type="password" label="Password"/>

                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting}
                                        className="btn btn-secondary btn-block">Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-center">
                    <Link to="/auth/password/forgot">Forgot password?</Link> | Have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: "signup"
})(SignupForm);
