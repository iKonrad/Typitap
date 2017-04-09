import React, {Component} from 'react';
import {connect} from 'react-redux';


class Home extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {

        console.log(this.props.user);
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <p>Dashboard</p>
                        { this.props.user.name  ? this.props.user.name : "Anonymous" }
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

export default connect(mapStateToProps)(Home);