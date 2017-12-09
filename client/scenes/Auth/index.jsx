import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordForgotForm from './components/PasswordForgotForm';
import { Link } from 'react-router';

class Auth extends Component {


    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }


    renderForm() {

        let redirectLink = this.props.location.query.redirect !== undefined ? this.props.location.query.redirect : null;

        if (this.props.route.path === '/signup') {
            return (
                <SignupForm redirect={redirectLink}/>
            );
        } else if (this.props.route.path === '/login') {
            return (
                <LoginForm redirect={redirectLink}/>
            );
        } else if (this.props.route.path === '/auth/password/forgot') {
            return (
                <PasswordForgotForm/>
            );
        } else {
            let response = this.props.app.response;
            let isValid = response.success && response.valid;
            return (
                <PasswordResetForm token={this.props.params.token} isValid={isValid}/>
            );
        }
    }

    render() {
        return (
            <div className="auth container-fluid">
                <div className="row">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-3 col-xxl-3 mx-auto">
                        <div className="text-center">
                            <Link to="/"><img src="/static/images/identity/typitap-logo-white@1.25x.png" alt=""/></Link>
                        </div>
                        {this.renderForm()}
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