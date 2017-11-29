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
            <div className="container">
                <div className="row">
                    <div className="col-8 col-xs-offset-2 mt-8">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="text-center mt-5 mb-5">

                                    <div className="row">
                                        <div className="col-12 col-md-4 col-md-offset-4">
                                            <img width="100%" src="/static/images/pages/errors/image.png" />
                                        </div>
                                    </div>
                                    <h2 className="mt-6">Page not found</h2>
                                    <p>Ooops. The page you’re looking for has been moved or deleted.</p>

                                    <Link to="/" className="btn btn-link mt-5">Back to homepage</Link>
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