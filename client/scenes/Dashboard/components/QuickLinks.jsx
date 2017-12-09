
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';

class QuickLinks extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>Quick Links</h3>
                </div>
                <div className="panel-body">
                    <Link to="/" className="text-primary">Play</Link><br />
                    <Link to="/account/details" className="text-primary">My Account</Link><br />
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(QuickLinks);