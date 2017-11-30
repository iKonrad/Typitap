import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Navigation from './components/Navigation';

class AdminBase extends Component {

    render() {
        return (
            <div id="admin">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="pull-right mt-2">
                                <Link to="/account" className="btn btn-link">Logged in as <strong>{ this.props.user.data.Name }</strong></Link>
                                <Link to="/" className="btn btn-default btn-round btn-sm">Back to site</Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="text-center mt-3">
                                <img src="/static/images/identity/typitap-logo@1.25x.png" alt=""/>
                                <h3>Admin Control Card</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-8 col-md-offset-2">
                            <div className="text-center mt-3 mb-1">
                                <Navigation/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mt-4">
                                { this.props.children }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(AdminBase);