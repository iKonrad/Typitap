import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UserActions from 'store/modules/userModule';
import RecentGamesRow from './RecentGamesRow';

class RecentGames extends Component {




    static onEnter({store, next, replace, callback}) {
        callback();
    }

    renderItems() {

        if (this.props.dashboard.games !== undefined) {
            let items = this.props.dashboard.games.map((item, index) => {
                let date = new Date(item.created);
                date = parseInt(date.getTime()/1000|0);
                return (
                    <RecentGamesRow perfect={ Object.keys(item.mistakes).length < 1 ? 1 : 0 }
                                    key={ 'activity-item-' + index } date={ date }
                                    name={item.session.online ? "Online race" : "Offline race"} score={item.wpm}/>
                );
            });
            return items;
        } else {
            return "";
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