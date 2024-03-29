import React from 'react';

class UserLevel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            exp: props.exp,
            next: props.next,
            level: props.level,
            levelName: props.levelName,
        };
        this.state['points'] = props.points !== undefined ? props.points : 0;
    }

    componentWillReceiveProps(newProps) {
        let newState = {
            exp: newProps.exp,
            next: newProps.next,
            level: newProps.level,
            levelName: newProps.levelName,
        };
        newState['points'] = newProps.points !== undefined ? newProps.points : 0;
        this.setState(newState);
    }


    getIconAddress() {
        if (this.state.level > 15) {
            return "/static/images/levels/level_15.svg";
        } else {
            return `/static/images/levels/level_${this.state.level}.svg`;
        }
    }

    renderProgress() {
        if (this.state.exp !== undefined && this.state.next !== undefined) {
            return (
                <div className="user-level__progress progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={ this.state.exp }
                        aria-valuemin="0"
                        aria-valuemax={ this.state.next }
                        style={{ 'width': `${ (this.state.exp / this.state.next) * 100 }%` }}>
                    </div>
                </div>
            );
        }
        return (<div className="user-level__progress transparent"></div>);
    }

    renderPoints() {
        if (this.state.points > 0) {
            let string = "+" + this.state.points + " exp";
            if ((this.state.exp + this.state.points) > this.state.next) {
                string = string + " leveled up!";
            }
            return string;
        }
    }

    render() {
        return (
            <div className={`user-level ${!!this.props.light ? "user-level--light" : ""}`} style={{marginTop: "15px"}} title={`${this.state.exp} / ${ this.state.next }`}>
                { this.renderProgress() }
                <div className="user-level__icon">
                    <img src={ this.getIconAddress() } alt=""/>
                </div>
                <div className="user-level__name">
                    <span>{ this.state.level }</span> { this.state.levelName }
                </div>
                <div className="user-level__points">
                    { this.renderPoints() }
                </div>
            </div>
        );
    }
}

export default UserLevel;