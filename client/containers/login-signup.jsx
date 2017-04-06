import React, {Component} from 'react';
import {connect} from 'react-redux';
import FormActions from 'actions/formActions';
import LoginForm from 'components/modules/form/LoginForm';
import SignupForm from 'components/modules/form/SignupForm';

class LoginSignup extends Component {

    static onEnter({store, nextState, replaceState, callback}) {

        callback();
    }

    handleLogin(e, values) {
        e.preventDefault();
        console.log("LOGIN TRIGGERED");
        var values = this.props.form.login.values;
    }


    handleSignup(e) {
        e.preventDefault();
        console.log("SIGNUP TRIGGERED");
        var values = this.props.form.signup.values;
        return FormActions.submitSignup(values);
    }


    renderForm() {

        if (this.props.route.path === '/signup') {
            return (
                <SignupForm handleSubmit={ (e) => { this.handleSignup(e); } }/>
            );
        } else {
            return (
                <LoginForm handleSubmit={ (e) => { this.handleLogin(e); } }/>
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