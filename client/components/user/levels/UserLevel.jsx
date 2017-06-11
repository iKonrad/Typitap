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


    getIconAddress() {
        if (this.state.level > 15) {
            return "/static/images/levels/level_15.svg";
        } else {
            return `/static/images/levels/level_${this.state.level}.svg`;
        }
    }

    componentDidMount() {

        if (this.state.points !== undefined && this.state.points > 0) {
            let state = this.state;
            let nextExp = state.exp + state.points;

            if (nextExp > state.next) {
                state.exp = state.next
            } else {
                state.exp = nextExp;
            }
            this.setState(state);
        }
    }

    renderProgress() {

        if (this.state.exp !== undefined && this.state.next !== undefined) {
            return (
                <div className="user-level__progress">
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
            let string = "+" + this.state.points;
            if ((this.state.exp + this.state.points) > this.state.next) {
                string = string + " leveled up!";
            }
            return string;
        }
    }

    render() {
        return (
            <div className="user-level" style={{marginTop: "15px"}} title={`${this.state.exp} / ${ this.state.next }`}>
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