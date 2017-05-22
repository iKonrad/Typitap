import React, {Component} from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Sidebar from './components/Sidebar';

class Account extends Component {

    render() {
        return (
            <div className="account">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12 col-md-3"><Sidebar /></div>
                        <div className="col col-xs-12 col-md-9">{ this.props.children }</div>
                    </div>
                </div>
            </div>
        )
    }

}

let mapStateToProps = (state) => {
    return {
        account: state.account,
        user: state.user
    }
};

export default connect(mapStateToProps)(Account);