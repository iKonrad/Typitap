import React from 'react';
import Popover from "react-popover"
import Spinner from 'components/app/Spinner';
import StatsBadge from 'components/user/UserStatsBadge';
import * as GameUtils from 'utils/gameUtils';
import ScorePopoverPlayback from './ScorePopoverPlayback';

class ScorePopover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        }
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.open !== this.props.open) && newProps.open && this.props.resultId !== undefined && this.props.resultId.length > 0 && Object.keys(this.state.data).length === 0) {
            fetch(`/api/game/result/${this.props.resultId}`, {
                credentials: "same-origin",
                headers: {
                    "Cookie": global.clientCookies
                }
            }).then((response) => {
                return response.json();
            }).then((response) => {
                if (response.success) {
                    if (response.data !== undefined && response.data !== null) {
                        let state = this.state;
                        state.data = response.data;
                        this.setState(state);
                    }
                }
            });
        }
    }



    renderResults() {
        return (
            <div className="mt-3">
                <div className="pull-left">
                    <StatsBadge key={ `result-place` } type="transparent" label={ this.state.data.Place > 0 ? (this.state.data.Place + " place") : "Offline game" }
                                value={ this.state.data.Place > 0 ? <i className="fa fa-trophy"></i> : "-" }/>
                    <StatsBadge key={ `result-wpm` } type="wpm" label="wpm"
                                value={ this.state.data.WPM }/>
                    <StatsBadge key={ `result-accuracy` } type="accuracy" label="accuracy"
                                value={ this.state.data.Accuracy + "%" }/>
                </div>
                <div className="pull-right">
                    <StatsBadge key={ `result-time` } type="time"
                                value={ GameUtils.formatTime(this.state.data.Time) }/>
                    <StatsBadge key={ `result-mistakes` } type="mistakes"
                                value={ Object.keys(this.state.data.Mistakes).length }/>
                </div>
            </div>
        );
    }

    renderBody() {
        if (Object.keys(this.state.data).length > 0) {
            return (
                <div>
                    <div className="row">
                        <div className="col">
                            <ScorePopoverPlayback resultId={ this.props.resultId } text={ this.state.data.Session.Text.Text } mistakes={ this.state.data.Mistakes } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            { this.renderResults() }
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{minWidth: "500px", padding: "50px"}}>
                    <Spinner/>
                </div>
            );
        }
    }

    render() {
        return (
            <Popover onOuterAction={ this.props.onOuterAction } target={ this.props.target } isOpen={this.props.open}
                     body={ this.renderBody() } tipSize={15} refreshIntervalMs={40}>
                { this.props.children }
            </Popover>
        );
    }
}

export default ScorePopover;