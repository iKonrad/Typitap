import React, {Component} from 'react';
import {connect} from 'react-redux';


class Homepage extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <p>Homepage</p>
                    </div>
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

export default connect(mapStateToProps)(Homepage);