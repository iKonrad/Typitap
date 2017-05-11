import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

class Details extends React.Component {
    static onEnter({store, next, replace, callback}) {
        callback();
    }

    // Runs after side-server rendering
    static initialize(response, params, store) {
        return "";
    }

    render() {
        return (
            <div className="details-page">
                <div className="panel panel-default">
                    <div className="panel-body">
                        Page
                    </div>
                </div>
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(Details);