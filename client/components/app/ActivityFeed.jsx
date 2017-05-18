
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Activity from 'components/app/Activity';

class ActivityFeed extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    parseMessage(text, data) {

        Object.keys(data).forEach((key, index) => {
            let value = data[key];
            text = text.replace("{" + key + "}", value);
        });

        return text;

    }


    renderItems() {
        let that = this;
        if (this.props.dashboard.feed !== undefined && this.props.dashboard.feed.length > 0) {
            let items = this.props.dashboard.feed.map((item, index) => {
                return (<Activity key={ "activity-" + index } icon={ item.Type.Icon } text={ that.parseMessage(item.Type.Text, item.Data) } date={new Date(item.Created)} />
                );
            });
            return items;
        }

        return (
            <div className="text-center text-muted" style={{padding: "20px"}}>Your feed is empty</div>
        );
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>Activity Feed</h3>
                </div>
                <div id="feed" className="feed">
                    { this.renderItems() }
                </div>

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