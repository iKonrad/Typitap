import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';



const LoginForm = (props) => {
    const { handleSubmit, pristine, reset, submitting } = props;
    return (
        <div className="panel panel-default card-login">
            <div className="panel-heading"><h2>Log in</h2></div>
            <div className="panel-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="_username">Username</label>
                        <Field name="username" component="input"  className="form-control" type="text"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="_password">Password</label>
                        <Field name="password" component="input"  type="password" className="form-control" placeholder="Password"/>
                        <span className="help-block"> </span>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-block">Log in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default reduxForm({
     form: "login"
})(LoginForm);
