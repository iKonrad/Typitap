
import React, {Component} from 'react';
import {connect} from 'react-redux';


class UserStats extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    UserStats
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

export default connect(mapStateToProps)(UserStats);