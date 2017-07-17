import React, {PureComponent} from 'react';
import Time from 'react-timeago';

class TimeAgo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: "",
        }
    }

    componentDidMount() {
        let state = this.state;
        state.date = this.props.date;
        this.setState(state);
    }

    render () {
        if (this.state.date !== "") {
            // return <TimeAgo datetime={ new Date(this.state.created) } />
            return <Time date={this.state.date} minPeriod={4} live={false} />
        }
        return (<span></span>);
    }
}

export default TimeAgo;