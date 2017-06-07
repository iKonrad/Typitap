import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import SimpleItem from './../components/AccountSimpleItem';
import * as UserUtils from 'utils/userUtils';
class Details extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="details-page">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <SimpleItem name="Name" />
                        <SimpleItem name="Email" />
                        <SimpleItem name="Password" type="password"/>
                        <SimpleItem name="Keyboard" />
                        <SimpleItem name="KeyboardLayout" label="Keyboard layout" type="select" options={ UserUtils.keyboardLayouts } />
                        <SimpleItem name="Bio" type="textarea" />
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