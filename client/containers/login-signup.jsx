import React, {Component} from 'react';
import {connect} from 'react-redux';
import FormActions from 'actions/formActions';
import LoginForm from 'components/modules/form/LoginForm';
import SignupForm from 'components/modules/form/SignupForm';
import PasswordResetForm from 'components/modules/form/PasswordResetForm';
import PasswordForgotForm from 'components/modules/form/PasswordForgotForm';

class LoginSignup extends Component {

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
        } else if (this.props.route.path === '/password/forgot') {
            return (<PasswordForgotForm/>);
        } else {
            return (
                <PasswordResetForm token={ this.props.params.token } />
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
        demo: state.demo,
        user: state.user,
        form: state.form,
    }
};

export default connect(mapStateToProps)(LoginSignup);