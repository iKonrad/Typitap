import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import UserActions from 'actions/userActions';


class Activate extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }


    static fetchData({query, params, store}) {
        // return store.

        return store.dispatch(UserActions.activateUser(params.token));
    }

    componentDidMount(props) {
        browserHistory.push('/');
    }

    render() {
        return (<div>Activating...</div>);
    }

}

let mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Activate);


