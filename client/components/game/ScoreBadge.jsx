import React, { Component } from 'react';

class ScoreBadge extends Component {

    renderIcon(perfect) {
        if (perfect) {
            return <i className='fa fa-star'></i>;
        }
    }

    getBadgeClass() {
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

        if (this.props.perfect) {
            badgeClass = badgeClass + ' ' + 'badge--icon';
        }

        return badgeClass;
    }

    render() {
        return (
            <div className={ this.getBadgeClass() }>
                { this.props.score }
                { this.renderIcon(this.props.perfect) }
            </div>
        );
    }

}

export default ScoreBadge;
