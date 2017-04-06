import React, { Component } from 'react';
// import cookie from 'react-cookie';
import Actions from 'actions/userActions';
import { connect } from 'react-redux';

class AuthenticatedComponent extends Component {


    static checkAuth(store) {

        let userCookie;
        if (typeof(userCookie) === "undefined") {
             store.dispatch(Actions.logOut());

        }
    }

}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(AuthenticatedComponent);