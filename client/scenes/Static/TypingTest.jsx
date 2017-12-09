import React from 'react';
import {push} from 'react-router-redux';
import Helmet from 'react-helmet';
import * as AppActions from 'store/ducks/appModule';
import * as SocketActions from "#app/store/ducks/socketModule";
import {connect} from "react-redux";
import * as GameEngine from "#app/utils/gameEngine";
import WhySignUpSection from 'components/sections/WhySignUpSection';

class TypingTest extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
        return Promise.resolve();
    }

    handlePlayClick() {
        this.props.dispatch(push("/play"));
        GameEngine.resetGame();
        this.props.dispatch(AppActions.closeOnlineSidebar());
        this.props.dispatch(SocketActions.joinRoom(false));
    }

    render() {
        return (
            <div id="typing-test">
                <Helmet title="Typing test online" />
                <div className="section section--pattern">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="text-center">
                                    <h1>Start typing test online and calculate your typing speed</h1>
                                    <p className="text-lg">An average person’s typing speed is around 40 words per minute. Can you beat that?</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="text-center">
                                    <button onClick={ this.handlePlayClick.bind(this) } className="btn btn-success btn-xxl">Start test</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="section">
                        <div className="row">
                            <div className="col col-md-6">
                                <img className="img-fluid" src="/static/images/pages/homepage/feature_2.jpg" alt="Game screen"/>
                            </div>
                            <div className="col col-md-6">
                                <h2>How do we measure typing speed?</h2>
                                <p>In typitap, typing speed is measured in words per minute (wpm).</p>
                                <p>WPM is the most common measure for the speed of typing, reading and even Morse code sending and receiving.</p>
                                <p>However, many online speed tests provide inacurrate result due to words having variable lengths. With that said, a word “me”, would have the same weight as “comprehensive”, even though there’s clearly a big difference in characters length.</p>
                                <p>In typitap, we recalculate words into <strong>5 characters chunks</strong> (which is an average length of an English word) and provide you with trustworthy and accurate test results.</p>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="row">
                            <div className="col col-md-6 text-center">
                                <div className="info-blob">
                                    <div className="info-blob__counter">
                                        40
                                    </div>
                                    <div className="info-blob__caption">
                                        wpm
                                    </div>
                                </div>
                            </div>
                            <div className="col col-md-6">
                                <h2>What is an average typing speed?</h2>
                                <p>It has been estimated that an average person types around 40 words per minute.  Professional typists, though, usually are able to type around 65-70 wpm and more.</p>

                                <p><strong>So, typing more than 40 words per minute puts you in the “above average” range when it comes to typing speed.</strong></p>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="row">
                            <div className="col col-md-6 text-center">
                                <div className="info-blob info-blob--yellow mt-2">
                                    <div className="info-blob__counter">
                                        216
                                    </div>
                                    <div className="info-blob__caption">
                                        wpm
                                    </div>
                                </div>
                            </div>
                            <div className="col col-md-6">
                                <h2>What is fastest typing speed?</h2>
                                <p>The world record for being the fastest typist in the world is currently held by Stella Pajunas, an ex-IBM Electric typewriter, who managed to type a whopping 216 words per minute. To put that into perspective, she typed <strong>faster than 5 average people combined</strong>.</p>
                                <p>For shorter texts there were also instances of people reaching over 270 wpm in online games.</p>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="row">
                            <div className="col col-md-6 text-center">
                                <div className="info-blob info-blob--teal">
                                    <div className="info-blob__counter">
                                        92%
                                    </div>
                                    <div className="info-blob__caption">
                                        accuracy
                                    </div>
                                </div>
                            </div>
                            <div className="col col-md-6">
                                <h2>But... what if I make a typo?</h2>
                                <p>Worry not. An average person has around 92% typing accuracy, which suggests that a one
                                    typo is made for every 10 words typed.</p>
                                <p>It's been found, however, that making mistakes can slow down your typing speed by as much
                                    as 50%, therefore maintaining a good accuracy is a key to become the best typist.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section section--grey">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="banner__titles">
                                    <h2 className="h1">Are you up for the challenge?</h2>
                                    <p className="text-lg">Check your typing speed and improve your results</p>
                                </div>
                                <div className="banner__content">
                                    <button onClick={ this.handlePlayClick.bind(this) } className="btn btn-success btn-xxl">Start test</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                { this.props.user.loggedIn ? "" : <div className="section section--pattern"><WhySignUpSection/></div>}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps)(TypingTest)