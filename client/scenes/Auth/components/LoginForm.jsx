import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as FormActions from 'store/modules/formModule';
import * as UserActions from 'store/modules/userModule';
import Input from 'components/form/fields/Input';
import { Link } from 'react-router';
import { push } from 'react-router-redux'
import Notifications from 'react-notification-system-redux';
class LoginForm extends Component {


    handleSubmitForm(values) {
        return FormActions.submitLogin(values).then((details) => {
            this.props.dispatch(UserActions.loginUser(details.user));
            this.props.dispatch(Notifications.info({'message': `Welcome back, ${details.user.name}!`}));
        }).then(() => {
            this.props.dispatch(push("/"));
        });
    };



    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div>
                <div className="panel panel-default card-login">
                    <div className="panel-heading"><h2>Log in</h2></div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                            <Field name="username" component={ Input } type="text" label="Username"/>
                            <Field name="password" component={ Input } type="password" label="Password"/>
                            <div className="form-group">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-secondary btn-block">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-center">
                    <Link to="/auth/password/forgot">Forgot password?</Link> | Don't have an account? <Link to="/signup">Get one</Link>
                </div>
            </div>
        );
    }

}

export default reduxForm({
    form: 'login', // a unique name for this form
})(LoginForm);