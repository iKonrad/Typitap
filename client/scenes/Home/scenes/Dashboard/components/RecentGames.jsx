import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UserActions from 'store/modules/userModule';
import RecentGamesRow from './RecentGamesRow';

class RecentGames extends Component {




    static onEnter({store, next, replace, callback}) {
        callback();
    }

    renderItems() {

        if (this.props.dashboard.games && this.props.dashboard.games.length > 0) {
            let items = this.props.dashboard.games.map((item, index) => {
                console.log(item);

                return (
                    <RecentGamesRow perfect={ Object.keys(item.mistakes).length < 1 ? 1 : 0 }
                                    key={ 'activity-item-' + index } date={ new Date(item.created) }
                                    name={item.session.online ? "Online race" : "Offline race"} score={item.wpm}/>
                );
            });
            return items;
        } else {
            return (<div className="panel-body text-muted text-center">You haven't played any games yet.</div>);
        }

    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>Recent Games</h3>
                    { this.renderItems() }
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        dashboard: state.dashboard,
    }
};

export default connect(mapStateToProps)(RecentGames);