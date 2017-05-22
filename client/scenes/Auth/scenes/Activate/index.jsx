import React, {Component} from 'react'
import {push} from 'react-router-redux';
import {connect} from 'react-redux';



class Activate extends Component {


    static onEnter({store, next, replace, callback}) {
        callback();
    }


    renderSuccessMessage() {
        return "Your account has been activated. You can now log in using your login and password";
    }

    renderErrorMessage() {
        return this.props.app.response.error ? this.props.app.response.error : "An error occurred while fetching your token.";
    }


    render() {
        let response = this.props.app.response;
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <div className="panel panel-default card-login">
                            <div className="panel-heading"><h2>Account activation</h2></div>
                            <div className="panel-body">
                                { response.success ? this.renderSuccessMessage() : this.renderErrorMessage() }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

let mapStateToProps = (state) => {
    return {
        user: state.user,
        app: state.app,
    };
};

export default connect(mapStateToProps)(Activate);


