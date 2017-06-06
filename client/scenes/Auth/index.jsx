import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordForgotForm from './components/PasswordForgotForm';


import {Link} from 'react-router';

class Auth extends Component {


    static clientInit({store, nextState, replaceState, callback}) {
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
            return (
                <PasswordForgotForm/>
            );
        } else {
            let response = this.props.app.response;
            let isValid = response.success && response.valid;
            return (
                <PasswordResetForm token={ this.props.params.token } isValid={ isValid }/>
            );
        }
    }

    render() {
        return (
            <div className="auth">

                <div className="auth__panel">
                    <div className="text-center">
                <Link to="/"><img src="/static/images/identity/typitap-logo-white@1.5x.png" alt="Typitap logo" /></Link>
            </div>
                { this.renderForm() }
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