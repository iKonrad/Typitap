import React from 'react';
import {Link} from 'react-router';

class WhySignUpSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-12 feature-title">
                                <div className="feature-title__icon">
                                    <i className="fa fa-trophy text-white fa-5x"></i>
                                </div>
                                <div className="feature-title__text">
                                    <h2 className="white mb-1">Create account</h2>
                                    <p className="white text-lg">It's free, forever.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h5 className="white mt-5">Creating an account comes with a plenty of cool benefits:</h5>
                            </div>
                            <div className="col-12 col-sm-6">
                                <ul className="feature-list feature-list--white mt-1 mb-4">
                                    <li>Stand out from the crowd and use custom username</li>
                                    <li>Save all your game results</li>
                                    <li>View & <strong>playback</strong> all your past games</li>
                                    <li>Comment on other players profiles</li>
                                </ul>
                            </div>
                            <div className="col-12 col-sm-6">
                                <ul className="feature-list feature-list--white mt-1 mb-4">
                                    <li>Follow your <strong>friends</strong> and keep an eye on their
                                        performance
                                    </li>
                                    <li><strong>Level up</strong> and show off your skills to other users</li>
                                    <li>Climb to the TOP in <strong>charts</strong> and win prizes</li>
                                    <li>Beautiful dashboard with <strong>stats</strong> and useful data</li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mx-auto mt-4">
                                <Link to="/signup" className="btn btn-secondary btn-block">Create account</Link>
                                <div className="mt-3 text-center">
                                    <span className="text-white">Have an account?</span>
                                    <Link to="/login" className="btn btn-link btn-sm btn-white">Log in</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WhySignUpSection;