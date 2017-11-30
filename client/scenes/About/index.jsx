import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as AppActions from 'store/ducks/appModule';
import TopChart from 'components/app/TopChart';
import {resolveAll} from 'utils/jsUtils';
import * as LobbyActions from 'scenes/Lobby/ducks/lobbyModule';
import Card from 'components/app/Card';
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
            store.dispatch(LobbyActions.fetchGlobalFeed()),
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
                <div className="banner-wrapper">
                    <div className="banner">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div className="row">

                                        <div className="col-12 text-center banner__content">
                                            <div className="banner__title">
                                                <img src="/static/images/identity/typitap-logo-white@1.5x.png"
                                                     alt="Typitap.com logo"/>
                                                <h1 style={{fontSize: "28px"}}>Ultimate online typing game</h1>
                                            </div>
                                            <div className="banner__buttons">

                                                <Link to="/" className="btn btn-round btn-xxl btn-success">Enter
                                                    the game</Link>

                                                <div className="mt-4 mb-4 white">- or -</div>

                                                <Link to="/signup" className="btn btn-round btn-outline btn-white">Create
                                                    account</Link>
                                            </div>
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
                            <div className="col-12 col-sm-6 col-md-3 ">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-globe.png" alt="Icon Globe"/>
                                    </div>

                                    <h2 className="blob__title">Compete and race with real people</h2>
                                    <p className="blob__text">Jump into the race track with people from around the
                                        entire world and challenge your typing skills.</p>
                                </div>

                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-trophy.png" alt="Icon Trophy"/>
                                    </div>
                                    <h2 className="blob__title">Climb the ladder to the top</h2>
                                    <p className="blob__text">Make your way to the very top of the
                                        <strong>typitap</strong> charts and show off your progress</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-chart.png" alt="Icon Chart"/>
                                    </div>
                                    <h2 className="blob__title">Track your typing skills progress</h2>
                                    <p className="blob__text">Make use of the <strong>stunning charts</strong> to keep
                                        track on your progress and see how you perform on a long term basis</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-comment.png" alt="Icon Comment"/>
                                    </div>
                                    <h2 className="blob__title">Socialize and compare</h2>
                                    <p className="blob__text">Follow your friends and stay up to date with their
                                        recent results and never miss out a tiny detail.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--white">
                    <div className="container">
                        <div className="row mb-8 text-center">
                            <h2>What is typitap?</h2>
                            <p>Typitap is an online typing game where players from the entire world compete with each
                                other by re-typing text from the screen. If you enjoy typing on a keyboard, and wish
                                to <strong>improve</strong> and <strong>monitor</strong> your typing skills, typitap is
                                for you</p>
                        </div>
                        <div className="row mt-2">
                            <div className="col-12 col-md-4">
                                <div className="mt-7 mb-5">
                                    <h2>Compete with real people</h2>
                                    <p>Play with people from around the world and put your typing skills to the
                                        test.</p>
                                    <p>You can choose to play in <strong>online mode</strong> with people from around
                                        the world, or <strong>practice</strong> to prepare your skills for the race.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-7 col-md-offset-1 text-center">
                                <img src="/static/images/pages/homepage/feature_1.jpg" className="img-mobile-stretch"
                                     alt="Game screen"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--grey">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="mt-7 mb-5">
                                    <h2>View and replay your games</h2>
                                    <p>You can browse through all your past games and replay them in real-time to see
                                        how you performed. <strong>Just click on the result badge.</strong></p>
                                    <p>Compare your speed with the best in typitap and find out how to improve your
                                        typing skills</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-7 col-md-offset-1 text-center">
                                <img src="/static/images/pages/homepage/feature_2.jpg" className="img-mobile-stretch"
                                     alt="Game screen"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--white">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="mt-7 mb-5">
                                    <h2>Track your progress</h2>
                                    <p>Monitor your performance with stunning charts and see how your typing speed and accuracy improve over time.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-7 col-md-offset-1 text-center">
                                <img src="/static/images/pages/homepage/feature_4.jpg" className="img-mobile-stretch mt-5"
                                     alt="Game screen"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--grey">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="mt-5 mb-3">
                                    <h2>Shiny dashboard</h2>
                                    <p>On your dashboard, you can check your <strong>stats</strong>, chat with others
                                        and browse through past games.</p>
                                    <p>Moreover, with our advanced <strong>leveling system</strong>, getting yourself
                                        motivated has never been easier.</p>
                                    <p>You can also <strong>follow your friends</strong> and stay up to date with their
                                        most recent results.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-7 col-md-offset-1 text-center">
                                <img src="/static/images/pages/homepage/feature_3.jpg" className="img-mobile-stretch"
                                     alt="Game screen"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--light">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2>What's new?</h2>
                            </div>
                            <div className="col-12 col-md-7 col-lg-8 mt-5">
                                <Card title="Recent news" bodyClass=""
                                       loaded={this.props.lobby.feed !== undefined}><ActivityFeed
                                    feed={this.props.lobby.feed}/></Card>
                            </div>
                            <div className="col-12 col-md-5 col-lg-4 mt-5">
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
                            <div className="col">
                                <div className="row">
                                    <div className="col-12 feature-title">
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
                                    <div className="col">
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
                            <div className="col-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4">
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
        lobby: state.lobby,
    }
};

export default connect(mapStateToProps)(Homepage);