import React from 'react';
import Icon from '@fortawesome/react-fontawesome';

class UserStatsBadge extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIcon() {

    }

    renderIcon(type) {

        if (type !== undefined) {
            if (['goldenTrophies', 'silverTrophies', 'bronzeTrophies'].indexOf(type) > -1) {
                return <div className="badge-icon"><Icon icon={['fas', 'trophy']} className="badge-icon" /></div>
            } else {
                return <Icon icon={['far', this.props.type]} className="badge-icon" />;
            }
        } else {
            return "";
        }

    }

    renderText() {
        if (this.props.label !== undefined) {
            return (
                <div className="badge-label no-select">
                    { this.props.label }
                </div>
            );
        }


        return "";

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