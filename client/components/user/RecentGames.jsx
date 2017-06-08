import React, {Component} from 'react';
import {connect} from 'react-redux';
import ResultRow from 'components/app/ResultRow';

class RecentGames extends Component {

    renderItems() {

        if (this.props.games !== undefined && this.props.games !== null) {
            if (this.props.games.length > 0) {
                let items = this.props.games.map((item, index) => {
                    let isPerfect = 1;
                    if (item.mistakes !== undefined && item.mistakes !== null) {
                        isPerfect = Object.keys(item.mistakes).length < 1 ? 1 : 0
                    }
                    return (
                        <ResultRow perfect={ isPerfect }
                                   key={ 'activity-item-' + index } date={ new Date(item.created) }
                                   name={item.session.online ? "Online race" : "Offline race"} score={item.wpm} resultId={ item.id } />
                    );
                });
                return items;
            }
            return "";
        }

        return "";
    }

    componentWillUpdate(newProps) {
        if (newProps.games !== undefined && newProps.games !== this.props.games) {
            if (this.props.onLoad !== undefined) {
                this.props.onLoad()
            }
        }
    }

    fetchMoreResults() {
        if (this.props.onMore !== undefined) {
            this.props.onMore();
        }
    }

    renderMoreButton() {
        if (this.props.games && this.props.games.length > 0 && (this.props.hideButton === undefined || !this.props.hideButton)) {
            return (
                <div className="text-center">
                    <button className="btn btn-link" onClick={this.fetchMoreResults.bind(this)}>More</button>
                </div>
            );
        } else {
            return "";
        }

    }

    render() {
        return (<div>{this.renderItems()}</div>)
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        dashboard: state.dashboard,
    }
};

export default connect(mapStateToProps)(RecentGames);