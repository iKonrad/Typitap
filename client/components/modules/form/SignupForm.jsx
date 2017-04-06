import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';



const SignupForm = (props) => {
    const { handleSubmit, pristine, reset, submitting } = props;
    return (
        <div className="panel panel-default card-login">
            <div className="panel-heading"><h2>Sign up</h2></div>
            <div className="panel-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Field name="username" component="input"  className="form-control" type="text"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <Field name="email" component="input"  className="form-control" type="text"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">First name</label>
                        <Field name="name" component="input"  className="form-control" type="text"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field name="password" component="input"  type="password" className="form-control"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default reduxForm({
    form: "signup"
})(SignupForm);
