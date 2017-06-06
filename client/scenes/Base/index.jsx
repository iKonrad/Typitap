import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';
import * as socketActions from 'store/ducks/socketModule';
import AlertBar from './components/AlertBar';

class Base extends Component {


    constructor(props) {
        super(props);
        this.onUnload = this.disconnectWebsocket.bind(this)

        this.state = {
            loaded: false,
        }



    }

    componentDidMount() {
        this.props.dispatch(socketActions.connect());
        if (typeof window !== "undefined") {
            window.addEventListener('beforeunload', this.onUnload);
            let state = this.state;
            state.loaded = true;
            this.setState(state);
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

    launchNotifications() {
        if (this.state.loaded) {
            return <NotificationsSystem theme={theme} />
        }
    }


    render() {

        let showEmptyBase = false;
        this.props.router.routes.forEach((obj) => {
            if (obj.emptyBase !== undefined && obj.emptyBase) {
                showEmptyBase = true;
            }
        });

        return (
            <div className="app-wrapper">
                { showEmptyBase ? "" : (<Navbar />) }
                <div id="react-container" className="main-content">
                    { showEmptyBase ? "" : (<AlertBar/>) }
                    { this.props.children }
                </div>
                { this.launchNotifications() }

            </div>
        );
    }

}

const mapStatsToProps = (state) => {
    return {
        game: state.game,
        user: state.user,
    };
};

export default connect(mapStatsToProps)(Base);