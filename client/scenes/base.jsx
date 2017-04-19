import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import Notifications from 'react-notification-system-redux';
import * as socketActions from 'store/modules/socketModule';

class Base extends Component {


    componentDidMount() {
        this.props.dispatch(socketActions.connect());
    }

    render() {

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
        demo: state.demo,
        notifications: state.notifications,
    };
};

export default connect(mapStatsToProps)(Base);