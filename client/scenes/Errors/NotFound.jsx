import React from 'react';
import {Link} from 'react-router';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    static clientInit({store, nextState, replaceState, callback}) {
        return Promise.resolve();
    }

    render() {
        return (
            <div className="error-page">
                <div className="container">
                    <div className="row">
                        <div className="col-8 mx-auto">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center">
                                        <div className="row">
                                            <div className="col-12 col-md-4 mx-auto">
                                                <img className="img-fluid mt-5" src="/static/images/pages/errors/image.png"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col mt-4">
                                                <h1>Page not found</h1>
                                                <p>Ooops. The page you’re looking for has been moved or deleted.</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <Link to="/" className="btn btn-link btn-primary mt-5">Back to homepage</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;