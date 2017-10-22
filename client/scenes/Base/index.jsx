import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';
import * as socketActions from 'store/ducks/socketModule';
import AlertBar from './components/AlertBar';
import Footer from 'components/navigation/Footer';
import Helmet from 'react-helmet';
import OnlineRoomPanel from 'components/game/OnlineRoomPanel';

class Base extends Component {


    constructor(props) {
        super(props);
        this.onUnload = this.disconnectWebsocket.bind(this)

        let title = "typitap.com - ultimate online typing game";
        let socialTitle = title;
        let socialDescription = "Track and improve your typing speed!";

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
            return <NotificationsSystem theme={theme}/>
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

                <Helmet encodeSpecialCharacters={true}
                        titleTemplate="%s | typitap - online typing game. Test your typing skills and race real people"
                        defaultTitle="typitap - online typing game. Test your typing skills and race real people">
                    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
                    <meta name="description" content="Typitap is an online typing game where people can practice typing, race real people, and test and improve their typing skills while having a great fun"/>
                    <meta name="keywords" content="typing games, online typing games, typing test, online typing test, wpm, race, typing lessons, typing game, typing practice, free typing games, typing games for kids, typing skills, best typing games" />

                    <meta property="fb:app_id" content="1776657649242212"/>

                    <meta property="twitter:site" content="typitap"/>
                    <meta property="twitter:description" content="Typitap is an online typing game where people can practice typing, race real people, and test and improve their typing skills while having a great fun"/>
                    <meta name="twitter:title" content="typitap.com - online type racing"/>
                    <meta name="twitter:image" content="https://typitap.com/static/images/seo/og_image.png"/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:site" content="@typitap"/>

                    <meta property="og:site_name" content="typitap"/>
                    <meta property="og:locale" content="en_US"/>
                    <meta property="og:title" content="typitap.com - online typing game. Test your typing skills and race real people"/>
                    <meta property="og:description" content="Typitap is an online typing game where people can challenge, monitor and improve their typing skills."/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://typitap.com"/>
                    <meta property="og:image" content="http://typitap.com/static/images/seo/og_image.png"/>
                    <meta property="og:image:secure_url" content="https://typitap.com/static/images/seo/og_image.png" />

                    <meta name="google-site-verification" content="EccaHwv8owB_y6gXjiAHn_3GwbEzLabBiTORkhd17TY" />
                </Helmet>

                {showEmptyBase ? "" : (<Navbar/>)}

                <div id="react-container" className="main-content">
                    { showEmptyBase ? "" : (<AlertBar/>) }
                    { showEmptyBase || ((this.props.router.getCurrentLocation().pathname === "/" || this.props.router.getCurrentLocation().pathname === "/typing-test") && !this.props.user.loggedIn) ? "" : (<OnlineRoomPanel/>) }
                    {this.props.children }
                    { showEmptyBase ? "" : (<Footer/>) }
                </div>
                {this.launchNotifications()}

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