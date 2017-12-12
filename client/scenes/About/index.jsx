import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as AppActions from 'store/ducks/appModule';
import TopChart from 'components/app/TopChart';
import {resolveAll} from 'utils/jsUtils';
import * as LobbyActions from 'scenes/Lobby/ducks/lobbyModule';
import Card from 'components/app/Card';
import ActivityFeed from 'components/app/ActivityFeed';
import WhySignUpSection from 'components/sections/WhySignUpSection';
import Icon from '@fortawesome/react-fontawesome';

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

    static serverInit(response, params, store) {
        return [
            store.dispatch(AppActions.fetchChartsData()),
            store.dispatch(LobbyActions.fetchGlobalFeed()),
        ]
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
                <div className="section section--pattern">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="text-center">
                                    <h1 className="white">Ultimate online typing game</h1>
                                    <p className="white">Do you think you can type fast enough?</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-8 col-md-4 mx-auto col-lg-3 mt-3">
                                <Link to="/" className="btn btn-block btn-secondary">Play the game</Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-8 col-md-4 mx-auto col-lg-3 mt-3">
                                <Link to="/signup" className="btn btn-block btn-secondary btn-link btn-white">Create account</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="section">

                        <div className="row">
                            <div className="col">
                                <div className="text-center">
                                    <h2>What is typitap?</h2>
                                    <p>Typitap is an online typing game where players from the entire world compete with each other by re-typing text from the screen. If you enjoy typing on a keyboard, and wish to improve and monitor your typing skills, typitap is the game for you.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col mx-auto">
                                <div className="text-center mt-3">
                                    <img src="/static/images/pages/about/demo.gif" className="img-fluid" alt=""/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col col-sm-8 col-md-4 col-lg-3 mx-auto">
                                <Link to="/" className="btn btn-secondary btn-block">Join the game</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--gradient">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-12 col-sm-6 col-md-3 ">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <Icon icon={['fas', 'globe']} size="5x" fixed-width />
                                    </div>

                                    <h2 className="blob__title">Compete and race with real people</h2>
                                    <p className="blob__text">Jump into the race track with people from around the
                                        entire world and challenge your typing skills.</p>
                                </div>

                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <Icon icon={['fas', 'trophy']} size="5x" fixed-width />
                                    </div>
                                    <h2 className="blob__title">Climb the ladder to the top</h2>
                                    <p className="blob__text">Make your way to the very top of the
                                        <strong>typitap</strong> charts and show off your progress</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <Icon icon={['fas', 'chart-line']} size="5x" fixed-width />
                                    </div>
                                    <h2 className="blob__title">Track your typing skills progress</h2>
                                    <p className="blob__text">Make use of the <strong>stunning charts</strong> to keep
                                        track on your progress and see how you perform on a long term basis</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <Icon icon={['fas', 'comment-alt']} size="5x" fixed-width />
                                    </div>
                                    <h2 className="blob__title">Socialize and compare</h2>
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
                            <div className="col">
                                <h2>What's new?</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-8 mt-5">
                                <Card title="Recent news" bodyClass=""
                                       loaded={this.props.lobby.feed !== undefined}><ActivityFeed
                                    feed={this.props.lobby.feed}/></Card>
                            </div>
                            <div className="col-12 col-lg-4 mt-5">
                                <img style={{position: "absolute", right: "10px", zIndex: 2, top: "-40px"}}
                                     className="no-select no-drag" src="/static/images/pages/homepage/hint_arrow.png"/>
                                <TopChart name="month" title={`TOP 10 of ${month}`}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section section--pattern">
                    <WhySignUpSection/>
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