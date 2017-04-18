
import React, {Component} from 'react';
import {connect} from 'react-redux';


class RecentActivity extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    RecentActivity
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

export default connect(mapStateToProps)(RecentActivity);