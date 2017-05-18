import React, {Component} from 'react';
import {connect} from 'react-redux';

import Dashboard from './scenes/Dashboard';
import Homepage from './scenes/Homepage';


class Home extends Component {

    static initialize(response, params, store) {

        if (store.getState().user.loggedIn) {
            return "";
        } else {
            return Homepage.initialize(response, params, store);
        }

    }

    render() {
        if (this.props.user.loggedIn) {
            return (<Dashboard />);
        } else {
            return (<Homepage />)
        }

    }

}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Home);