import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import Notifications from 'react-notification-system-redux';
import * as socketActions from 'store/modules/socketModule';

class Base extends Component {


    constructor(props) {
        super(props)
        this.onUnload = this.disconnectWebsocket.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(socketActions.connect());
        if (typeof window !== "undefined") {
            window.addEventListener('beforeunload', this.onUnload);
        }
    }

    componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener('beforeunload', this.onUnload);
        }
        this.disconnectWebsocket();
    }

    disconnectWebsocket() {
        if (this.props.game.online) {
            this.props.dispatch(socketActions.leaveRoom());
        }
        this.props.dispatch(socketActions.disconnect());
    }


    render() {

        let showEmptyBase = false;
        this.props.router.routes.forEach((obj) => {
            if (obj.emptyBase !== undefined && obj.emptyBase) {
                showEmptyBase = true;
            }
        });

        if (showEmptyBase) {
            return this.props.children;
        }

        return (
            <div>
                <Navbar />
                <div id="react-container" className="main-content">
                    { this.props.children }
                </div>
                <Notifications
                    notifications={this.props.notifications} ref="notificationSystem" style={ false }
                />

            </div>
        );
    }

}

const mapStatsToProps = (state) => {
    return {
        game: state.game,
        notifications: state.notifications,
    };
};

export default connect(mapStatsToProps)(Base);