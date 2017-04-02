import React, { Component } from 'react';
import cookie from 'react-cookie';
import Actions from 'actions/userActions';
import { connect } from 'react-redux';

class AuthenticatedComponent extends Component {


    static checkAuth(store) {

        // Get the cookie if it exists
        console.log('Before cookie');
        let userCookie = cookie.load("ooo");
        console.log('Inside check AUTH');

        if (typeof(userCookie) === "undefined") {
            return store.dispatch(Actions.logOut());
        } else {
            if (!this.props.user.loggedIn) {
                // If user is not logged in, but the cookie is present, let's verify the token
                return store.dispatch(Actions.checkToken(userCookie));
            }
        }

    }

}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(AuthenticatedComponent);