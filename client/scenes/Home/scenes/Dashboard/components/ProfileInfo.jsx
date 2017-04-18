
import React, {Component} from 'react';
import {connect} from 'react-redux';


class ProfileInfo extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div className="panel panel-default profile-page__info">
                <div className="panel-body">
                    <div className="row">
                        <div className="col col-xs-12 col-sm-3 col-md-3">
                            <div className="profile__picture">
                                <img src="http://placehold.it/120x120" className="img-circle img-responsive" alt=""/>
                            </div>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-md-2 profile-page__info__details">
                            <p className="profile-page__info__name">{ this.props.user.data.Name }</p>
                            <p className="profile-page__info__username">#{ this.props.user.data.Username }</p>
                        </div>
                        <div className="col col-xs-12 col-sm-3 col-sm-offset-3 col-md-2 col-md-offset-5 profile-page__info__details--right">
                        </div>
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

export default connect(mapStateToProps)(ProfileInfo);