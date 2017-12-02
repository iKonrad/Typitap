import React, { PureComponent } from 'react';
import TimeAgo from 'components/app/TimeAgo';
import ScoreBadge from 'components/game/ScoreBadge';

class ResultRow extends PureComponent {


    renderPlace(place) {

        if (place && place > 0) {
            return (
                <div className="col-2 text-right">
                    <span className="result-rows__row__place">{ place }</span>
                </div>
            );
        }

        return "";

    }

    render(){
        return (
            <div className="result-rows__row row">
                { this.renderPlace(this.props.place) }
                <div className={"col-6"}>
                        <p className="text-md">{ this.props.name }</p>
                        <div className="text-caption"><small><TimeAgo date={ this.props.date } /></small></div>
                </div>
                <div className="col">
                    <div className="text-right">
                            <ScoreBadge score={ this.props.score } perfect={ this.props.perfect } resultId={ this.props.resultId }  />
                    </div>
                </div>
            </div>
        );
    }

}

export default ResultRow;