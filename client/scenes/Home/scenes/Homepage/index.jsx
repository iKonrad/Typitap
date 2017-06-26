import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as AppActions from 'store/ducks/appModule';
import TopChart from 'components/app/TopChart';
import {resolveAll} from 'utils/jsUtils';
import * as PlayActions from 'scenes/Play/ducks/playModule';
import Panel from 'components/app/Panel';
import ActivityFeed from 'components/app/ActivityFeed';


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

    render() {

        let date = new Date();
        let month = date.toLocaleString("en-us", {month: "long"});

        return (
            <div id="homepage">
                <div className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 text-center">
                                <div className="row">

                                    <div className="col col-xs-12 text-center banner__content">
                                        <div className="banner__title">
                                            <img src="/static/images/identity/typitap-logo-white@1.5x.png"
                                                 alt="Typitap.com logo"/>
                                            <h4>Ultimate online typing game</h4>
                                        </div>
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
                <div className="section section--white">
                    <div className="container">
                        <div className="row margin-bottom-5 text-center">
                            <h2>What makes typitap special?</h2>
                        </div>
                        <div className="row margin-top-2">
                            <div className="col col-xs-12 col-md-4">
                                <div className="margin-top-7 margin-bottom-5">
                                    <h2>Compete with real people</h2>
                                    <p>Play with people from around the world and put your typing skills to the
                                        test.</p>
                                    <p>You can choose to play in <strong>online mode</strong> with people from around
                                        the world, or <strong>practice</strong> to prepare your skills for the race.</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-md-7 col-md-offset-1">
                                <img src="/static/images/pages/homepage/feature_1.jpg" className="img-mobile-stretch" alt="Game screen"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--grey">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 col-md-4">
                                <div className="margin-top-7 margin-bottom-5">
                                    <h2>View and replay your games</h2>
                                    <p>You can browse through all your past games and replay them in real-time to see
                                        how you performed. <strong>Just click on the result badge.</strong></p>
                                    <p>Compare your speed with the best in typitap and find out how to improve your
                                        typing skills</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-md-7 col-md-offset-1">
                                <img src="/static/images/pages/homepage/feature_2.jpg" className="img-mobile-stretch" alt="Game screen"/>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="section section--white">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 col-md-4">
                                <div className="margin-top-5 margin-bottom-3">
                                    <h2>Shiny dashboard</h2>
                                    <p>On your dashboard, you can check your <strong>stats</strong>, chat with others
                                        and browse through past games.</p>
                                    <p>Moreover, with our advanced <strong>leveling system</strong>, getting yourself
                                        motivated has never been easier.</p>
                                    <p>You can also <strong>follow your friends</strong> and stay up to date with their
                                        most recent results.</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-md-7 col-md-offset-1">
                                <img src="/static/images/pages/homepage/feature_3.jpg" className="img-mobile-stretch" alt="Game screen"/>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="section section--light">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12">
                                <h2>Straight from the race tracks</h2>
                            </div>
                            <div className="col col-xs-12 col-md-7 col-lg-8 margin-top-5">
                                <Panel title="Recent news" bodyClass=""
                                       loaded={ this.props.play.feed !== undefined }><ActivityFeed
                                    feed={ this.props.play.feed }/></Panel>
                            </div>
                            <div className="col col-xs-12 col-md-5 col-lg-4 margin-top-5">
                                <img style={{position: "absolute", right: "10px", zIndex: 2, top: "-40px"}}
                                     className="no-select no-drag" src="/static/images/pages/homepage/hint_arrow.png"/>
                                <TopChart name="month" title={`TOP 10 of ${month}`}/>
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
                                            <h5 className="white">It's free, forever.</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col col-xs-12">
                                        <ul className="feature-list feature-list--white">
                                            <li>Stand out from the crowd and use custom username</li>
                                            <li>Save all your game results</li>
                                            <li>View & <strong>playback</strong> all your past games</li>
                                            <li>Follow your <strong>friends</strong> and keep an eye on their
                                                performance
                                            </li>
                                            <li>Track your performance on different keyboards</li>
                                            <li>Climb to the TOP in <strong>charts</strong> and win prizes</li>
                                            <li>Beautiful dashboard with <strong>stats</strong> and useful data</li>
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