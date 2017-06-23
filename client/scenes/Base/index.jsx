import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';
import * as socketActions from 'store/ducks/socketModule';
import AlertBar from './components/AlertBar';
import Footer from 'components/navigation/Footer';
import Helmet from 'react-helmet';

class Base extends Component {


    constructor(props) {
        super(props);
        this.onUnload = this.disconnectWebsocket.bind(this)

        let title = "typitap.com - ultimate online typing game.";
        let socialTitle = title;
        let socialDescription = "Track and improve your typing speed!";

        this.state = {
            loaded: false,
            metaTags: {
                title,
                meta: [
                    {
                        property: 'og:title',
                        content: socialTitle
                    },
                    {
                        name: 'viewport',
                        content: 'initial-scale=1.0, user-scalable=no'
                    },
                    {
                        property: 'og:description',
                        content: socialDescription
                    },
                    {
                        property: 'og:type',
                        content: "website"
                    },
                    {
                        property: 'og:image',
                        content: "http://typitap.com/static/images/seo/og_image.png"
                    },
                    {
                        property: 'og:image:secure_url',
                        content: "https://typitap.com/static/images/seo/og_image.png"
                    },
                    {
                        property: 'og:url',
                        content: "https://typitap.com"
                    },
                    {
                        property: 'fb:app_id',
                        content: '1776657649242212'
                    },
                    {
                        property: "og:site_name",
                        content: "typitap"
                    },
                    {
                        property: "og:image:width",
                        content: "600"
                    },
                    {
                        property: "og:image:height",
                        content: "315"
                    }

                ]
            }
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
                <Helmet { ...this.state.metaTags } />
                { showEmptyBase ? "" : (<Navbar />) }
                <div id="react-container" className="main-content">
                    { showEmptyBase ? "" : (<AlertBar/>) }
                    { this.props.children }
                    { showEmptyBase ? "" : (<Footer/>) }
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