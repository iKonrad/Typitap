import React, {Component} from 'react';
import {connect} from 'react-redux';

import Dashboard from './scenes/Dashboard';
import Homepage from './scenes/Homepage';


class Home extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        if (store.getState().user.loggedIn) {
            return Dashboard.clientInit({store, nextState, replaceState, callback});
        } else {
            return Homepage.clientInit({store, nextState, replaceState, callback});
        }
    }

    static serverInit(response, params, store) {
        if (store.getState().user.loggedIn) {
            return Dashboard.serverInit(response, params, store);
        } else {
            return Homepage.serverInit(response, params, store);
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