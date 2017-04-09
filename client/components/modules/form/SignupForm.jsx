import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { browserHistory } from 'react-router';

import Input from "./fields/Input";
import FormActions from 'actions/formActions';
import UserActions from 'actions/userActions';

class SignupForm extends Component {

    handleSubmitForm(values) {
        return FormActions.submitSignup(values).then((details) => {
            this.props.dispatch(UserActions.loginUser(details.user))
        }).then(() => {
            browserHistory.push("/");
        });
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return (
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
                                    className="btn btn-primary btn-block">Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: "signup"
})(SignupForm);
