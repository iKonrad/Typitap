import React, { Component } from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import Actions from 'actions/demoActions';

class Contact extends Component {

    static onEnter({store, nextState, replaceState, callback}) {
        callback();
    }


    render() {
        return (
            <div className="lol"><h1>Twoj stary</h1></div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        demo: state.demo
    }
};

export default connect(mapStateToProps)(Contact);