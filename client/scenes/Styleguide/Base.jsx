import React from 'react';
import Footer from 'components/navigation/Footer';
import Helmet from 'react-helmet';
import * as Constants from './utils/utils';
import Navbar from 'components/navigation/Navbar';

class StyleguideBase extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
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

                <Navbar menu={ Constants.MENU_TREE }/>

                <div id="react-container" className="main-content">
                    <div className="mt-5">
                        { this.props.children }
                    </div>

                </div>


            </div>
        );
    }
}

export default StyleguideBase;