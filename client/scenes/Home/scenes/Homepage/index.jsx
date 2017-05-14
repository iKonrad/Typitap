import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';


class Homepage extends Component {

    static onEnter({store, next, replace, callback}) {
        callback();
    }

    render() {
        return (
            <div id="homepage">
                <div className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 text-center">
                                <div className="banner__titles">
                                    <h1 className="white"><img src="/static/images/identity/typitap-logo-white@2x.png" alt=""/></h1>
                                    <h3 className="white">Ultimate online typing game</h3>
                                </div>
                                <div className="row">
                                    <div className="col col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3" >
                                        <textarea name="demo" id="" cols="30" rows="5" className="form-control" style={{resize: "none"}}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-xs-12 text-center">
                                        <div className="banner__buttons">
                                            <Link to="/play" className="btn btn-round btn-secondary">Play</Link>
                                            <Link to="/signup" className="btn btn-round btn-outline btn-white">Sign up</Link>
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
                                    <p className="blob__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aliquid delectus et fugit hic odit optio provident quisquam sint veniam!</p>
                                </div>

                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-trophy.png" alt="Icon Trophy"/>
                                    </div>
                                    <h3 className="blob__title">Climb the ladder to the top</h3>
                                    <p className="blob__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto aut corporis doloremque id iusto nisi officia quidem sapiente, voluptates?</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-chart.png" alt="Icon Chart"/>
                                    </div>
                                    <h3 className="blob__title">Track your progress</h3>
                                    <p  className="blob__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dicta earum error eveniet expedita hic pariatur quod suscipit, voluptatem! Porro?</p>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-6 col-md-3">
                                <div className="blob">
                                    <div className="blob__icon">
                                        <img src="/static/images/pages/homepage/icon-comment.png" alt="Icon Comment"/>
                                    </div>
                                    <h3 className="blob__title">Socialize</h3>
                                    <p className="blob__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquam nostrum pariatur quisquam quos reiciendis similique, vitae. Atque, libero, natus.</p>                                </div>
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
                                <div className="panel panel-white">
                                    <div className="panel-heading">
                                        <h5>Recent Activities</h5>
                                    </div>
                                    <div className="panel-body">
                                        Panel content
                                    </div>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-md-4">
                                <div className="panel panel-white">
                                    <div className="panel-heading">
                                        <h5>Today's bests</h5>
                                    </div>
                                    <div className="panel-body">
                                        Panel content
                                    </div>
                                </div>
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
                                            <li>Climb the ladder to the TOP and achieve the <i>typitap master</i> title</li>
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
        user: state.user
    }
};

export default connect(mapStateToProps)(Homepage);