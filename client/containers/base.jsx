import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import Notifications from 'react-notification-system-redux';

class Base extends Component {


    render() {

        return (
            <div id="main-container" className="main-container">
                <div id="wrap" className="container">
                    <Navbar />
                    <div id="react-container" className="main-content">
                        { this.props.children }
                    </div>
                    <Notifications
                        notifications={this.props.notifications} ref="notificationSystem" style={ false }
                    />
                </div>
            </div>
        );
    }

}

const mapStatsToProps = (state) => {
    return {
        demo: state.demo,
        notifications: state.notifications,
    };
};

export default connect(mapStatsToProps)(Base);