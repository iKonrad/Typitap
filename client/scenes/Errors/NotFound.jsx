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
                    <div className="col col-xs-8 col-xs-offset-2 margin-top-8">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="text-center margin-top-5 margin-bottom-5">

                                    <div className="row">
                                        <div className="col col-xs-12 col-md-4 col-md-offset-4">
                                            <img width="100%" src="/static/images/pages/errors/image.png" />
                                        </div>
                                    </div>
                                    <h2 className="margin-top-6">Page not found</h2>
                                    <p>Ooops. The page you’re looking for has been moved or deleted.</p>

                                    <Link to="/" className="btn btn-link margin-top-5">Back to homepage</Link>
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