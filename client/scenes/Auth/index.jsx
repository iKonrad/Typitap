import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordForgotForm from './components/PasswordForgotForm';

class Auth extends Component {

    static onEnter({store, nextState, replaceState, callback}) {

        callback();
    }


    renderForm() {

        if (this.props.route.path === '/signup') {
            return (
                <SignupForm />
            );
        } else if (this.props.route.path === '/login') {
            return (
                <LoginForm />
            );
        } else if (this.props.route.path === '/auth/password/forgot') {
            return (<PasswordForgotForm/>);
        } else {

            let response = this.props.app.response;
            let isValid = response.success && response.valid;

            return (
                <PasswordResetForm token={ this.props.params.token } isValid={ isValid } />
            );
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        { this.renderForm() }
                    </div>
                </div>
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        form: state.form,
        app: state.app,
    }
};

export default connect(mapStateToProps)(Auth);