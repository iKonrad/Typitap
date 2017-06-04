import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as AppActions from 'store/ducks/appModule';
import TopChart from 'components/app/TopChart';
import {resolveAll} from 'utils/jsUtils';
import * as PlayActions from 'scenes/Play/ducks/playModule';
import Panel from 'components/app/Panel';
import ActivityFeed from 'components/app/ActivityFeed';
import Typist from 'react-typist';

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    static clientInit({store, nextState, replaceState, callback}) {
        resolveAll([
            store.dispatch(AppActions.fetchChartsData()),
            store.dispatch(PlayActions.fetchGlobalFeed()),
        ], callback)
    }

    componentDidMount() {
        let state = this.state;
        state.loaded = true;
        this.setState(state);
    }

    delayGenerator({line, lineIdx, character, charIdx, defDelayGenerator}) {
        if (character === "." || character === "?" || character === "!") {
            return 60;
        } else {
            return 10;
        }
    }

    renderTyping() {
        if (this.state.loaded) {
            return (<Typist show={false} avgTypingDelay={60} stdTypingDelay={40}
                            delayGenerator={ function (mean, std, {line, lineIdx, character, charIdx, defDelayGenerator}) {
                                if (character === "." || character === "?" || character === "!") {
                                    return 1200;
                                } else {
                                    return 60;
                                }
                            } }>
                <span className="game__paragraph">Typitap is the most advanced online typing game made for people who love to type on their <span
                    className="word-error">keyboadrs</span>.</span>
                <span className="game__paragraph">Do you have what it <span className="word-error">tkaes</span> to make it to the top?</span>
                <span className="game__paragraph"><strong>Sign up</strong> or jump straight into the race track!</span>
            </Typist>)
        } else {
            return "";
        }
    }

    render() {
        return (
            <div id="homepage">
                <div className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 text-center">
                                <div className="banner__titles">
                                    <h1 className="white"><img src="/static/images/identity/typitap-logo-white@2x.png" alt=""/>
                                    </h1>
                                    <h3 className="white">Ultimate online typing game</h3>
                                </div>
                                <div className="row">
                                    <div className="col col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
                                        <div className="game">
                                            <div className="game__text">
                                                { this.renderTyping() }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-xs-12 text-center">
                                        <div className="banner__buttons">
                                            <Link to="/play" className="btn btn-round btn-secondary">Play</Link>
                                            <Link to="/signup" className="btn btn-round btn-outline btn-white">Sign
                                                up</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--dark">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col col-xs-12 col-sm-6 col-md-3 ">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-globe.png" alt="Icon Globe"/>
                                    </div>

                                    <h3 className="blob__title">Compete with the world</h3>
                                    <p className="blob__text">Jump into the race track with people from around the
                                        entire world and challenge your typing skills.</p>
                                </div>

                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-trophy.png" alt="Icon Trophy"/>
                                    </div>
                                    <h3 className="blob__title">Climb the ladder to the top</h3>
                                    <p className="blob__text">Make your way to the very top of the
                                        <strong>typitap</strong> charts and show off your progress</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-chart.png" alt="Icon Chart"/>
                                    </div>
                                    <h3 className="blob__title">Track your progress</h3>
                                    <p className="blob__text">Make use of the <strong>stunning charts</strong> to keep
                                        track on your progress and see how you perform on a long term basis</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-comment.png" alt="Icon Comment"/>
                                    </div>
                                    <h3 className="blob__title">Socialize</h3>
                                    <p className="blob__text">Follow your friends and stay up to date with their
                                        recent results and never miss out a tiny detail.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--light">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12">
                                <h3>Straight from the race tracks</h3>
                            </div>
                            <div className="col col-xs-12 col-md-8">
                                <Panel title="Recent news" bodyClass=""
                                       loaded={ this.props.play.feed !== undefined }><ActivityFeed
                                    feed={ this.props.play.feed }/></Panel>
                            </div>
                            <div className="col col-xs-12 col-md-4">
                                <TopChart name="today" title="Today's bests"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--gradient">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12 feature-title">
                                        <div className="feature-title__icon">
                                            <img src="/static/images/pages/homepage/icon-trophy.png" alt=""/>
                                        </div>
                                        <div className="feature-title__text">
                                            <h2 className="white">Create account</h2>
                                            <h5 className="white">Sign up and enjoy these features:</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col col-xs-12">
                                        <ul className="feature-list feature-list--white">
                                            <li>Save all your game results</li>
                                            <li>Track your progress with stunning charts</li>
                                            <li>Add friends and beat their records</li>
                                            <li>Track your performance on different keyboards</li>
                                            <li>Climb the ladder to the TOP and achieve the <i>typitap master</i> title
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4">
                                <Link to="/signup" className="btn btn-secondary btn-round btn-block">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
    }

    }


    const mapStateToProps = (state) => {
        return {
        user: state.user,
        play: state.play,
    }
    };

    export default connect(mapStateToProps)(Homepage);