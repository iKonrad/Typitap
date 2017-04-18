
import React, {Component} from 'react';
import {connect} from 'react-redux';


class ProgressChart extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    ProgressChart
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

export default connect(mapStateToProps)(ProgressChart);