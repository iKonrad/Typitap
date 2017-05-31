import React from 'react';

class UserLevel extends React.Component {
    constructor(props) {
        super(props);
    }


    getIconAddress() {
        if (this.props.level > 15) {
            return "/images/levels/level_15.svg";
        } else {
            return `/images/levels/level_${this.props.level}.svg`;
        }
    }

    renderProgress() {

        if (this.props.exp !== undefined && this.props.next !== undefined) {
            return (
                <div className="user-level__progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={ this.props.exp }
                        aria-valuemin="0"
                        aria-valuemax={ this.props.next }
                        style={{ 'width': `${ (this.props.exp / this.props.next) * 100 }%` }}>
                    </div>
                </div>
            );
        }

        return (<div className="user-level__progress transparent"></div>);

    }ą

    render() {
        return (
            <div className="user-level" style={{marginTop: "15px"}} title={`${this.props.exp} / ${ this.props.next }`}>
                { this.renderProgress() }
                <div className="user-level__icon">
                    <img src={ this.getIconAddress() } alt=""/>
                </div>
                <div className="user-level__name">
                    <span>{ this.props.level }</span> { this.props.levelName }
                </div>
            </div>
        );
    }
}

export default UserLevel;