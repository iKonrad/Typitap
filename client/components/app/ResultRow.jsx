import React, { PureComponent } from 'react';
import TimeAgo from 'components/app/TimeAgo';
import ScoreBadge from 'components/game/ScoreBadge';

class ResultRow extends PureComponent {


    renderPlace(place) {

        if (place && place > 0) {
            return (
                <div className="col col-xs-1 text-right">
                    <span className="result-row__place">{ place }</span>
                </div>
            );
        }

        return "";

    }

    render(){
        return (
            <div className="result-row row">
                { this.renderPlace(this.props.place) }
                <div className={"col col-xs-"+ (this.props.place ? 7 : 8)}>
                    <div className="data-table--cell">
                        <p className="text-md">{ this.props.name }</p>
                        <div className="text-caption"><small><TimeAgo date={ this.props.date } /></small></div>
                    </div>
                </div>
                <div className="col col-xs-4">
                    <div className="data-table--cell pull-right text-xl">
                            <ScoreBadge score={ this.props.score } perfect={ this.props.perfect } resultId={ this.props.resultId }  />
                    </div>
                </div>
            </div>
        );
    }

}

export default ResultRow;