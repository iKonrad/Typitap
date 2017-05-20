import React from 'react';

class UserStatsBadge extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIcon() {

    }

    renderIcon(type) {

        if (['goldenTrophies', 'silverTrophies', 'bronzeTrophies'].indexOf(type) > -1) {
            return (
                <div className="badge-icon"></div>
            );
        } else {
            return "";
        }

    }

    renderText(type) {

        if (['goldenTrophies', 'silverTrophies', 'bronzeTrophies'].indexOf(type) === -1) {
            return (
                <div className="badge-label no-select">
                    { this.props.type }
                </div>
            );
        } else {
            return "";
        }

    }


    render() {
        return (
            <div className={ `no-select no-drag stats-badge badge-${this.props.type}` }>
                <div className="badge-value">
                    { this.props.value }
                </div>
                { this.renderText(this.props.type) }
                { this.renderIcon(this.props.type) }
            </div>
        );
    }
}

export default UserStatsBadge;