
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Activity from 'components/app/Activity';

class ActivityFeed extends Component {

    parseMessage(text, data) {
        Object.keys(data).forEach((key, index) => {
            let value = data[key];
            let regexp = new RegExp("{" + key + "}", "g");
            text = text.replace(regexp, value);
        });
        return text;
    }

    componentWillUpdate(newProps) {
        if (newProps.feed !== undefined && this.props.feed !== newProps.feed) {
            this.props.onLoad();
        }
    }


    renderItems() {
        let that = this;
        if (this.props.feed !== undefined && this.props.feed.length > 0) {
            let items = this.props.feed.map((item, index) => {
                return (<Activity key={ "activity-" + index } icon={ item.Type.Icon } text={ that.parseMessage(item.Type.Text, item.Data) } date={new Date(item.Created)} />
                );
            });
            return items;
        }
        return "";
    }

    render() {
        return (

                <div id="feed" className="feed">
                    { this.renderItems() }
                </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        dashboard: state.dashboard,
    }
};

export default connect(mapStateToProps)(ActivityFeed);