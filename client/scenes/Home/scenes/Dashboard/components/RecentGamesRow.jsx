import React, { Component } from 'react';
import TimeAgo from 'react-timeago';

class RecentGamesRow extends Component {

    renderIcon(perfect) {
        if (perfect) {
            return <i className='fa fa-star'></i>;
        }
    }

    render(){

        var badgeColor = (score) => {
            let classes = 'result-badge badge--wpm badge--';

            if (score >= 200) {
                return classes + 'black';
            } else if (score >= 150) {
                return classes + 'blue';
            } else if (score >= 120) {
                return classes + 'info';
            } else if (score >= 90) {
                return classes + 'purple';
            } else if (score >= 70) {
                return classes + 'success';
            } else if (score >= 50) {
                return classes + 'default';
            } else if (score >= 30) {
                return classes + 'warning';
            } else if (score < 30) {
                return classes + 'danger';
            }
        };

        let badgeClass = badgeColor(this.props.score);

        if (this.props.perfect === 1) {
            badgeClass = badgeClass + ' ' + 'badge--icon';
        }

        return (
            <div className="data-table--row row">
                <div className="col col-xs-8 data-table--cell">
                    <p className="text-lg">{ this.props.name }</p>
                    <div className="text-caption"><small>"date"</small></div>
                </div>
                <div className="col col-xs-4 data-table--cell">
                    <div className="pull-right text-xl" >
                        <div className={ badgeClass }>
                            { this.props.score }
                            { this.renderIcon(this.props.perfect) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default RecentGamesRow;