import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FormActions from 'actions/formActions';
import Input from './fields/Input';


class LoginForm extends Component {


    handleSubmitForm(values) {
        return FormActions.submitLogin(values);
    };



    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div className="panel panel-default card-login">
                <div className="panel-heading"><h2>Log in</h2></div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                        <Field name="username" component={ Input } type="text" label="Username"/>
                        <Field name="password" component={ Input } type="password" label="Password"/>
                        <div className="form-group">
                            <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default reduxForm({
    form: 'login', // a unique name for this form
})(LoginForm);