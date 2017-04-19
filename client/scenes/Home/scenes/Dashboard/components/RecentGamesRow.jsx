import React, { Component } from 'react';
import TimeAgo from 'timeago-react';
import ScoreBadge from 'components/game/ScoreBadge';

class RecentGamesRow extends Component {



    render(){
        return (
            <div className="data-table--row row">
                <div className="col col-xs-8 data-table--cell">
                    <p className="text-md">{ this.props.name }</p>
                    <div className="text-caption"><small><TimeAgo datetime={ this.props.date } /></small></div>
                </div>
                <div className="col col-xs-4 data-table--cell">
                    <div className="pull-right text-xl" >
                        <ScoreBadge score={ this.props.score } perfect={ this.props.perfect }  />
                    </div>
                </div>
            </div>
        );
    }

}

export default RecentGamesRow;