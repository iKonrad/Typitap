import React from 'react';

class Home extends React.Component {
    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col mt-5">
                        <h2>Overview</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-2">
                        <p>Welcome to the Typitap Styleguide.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;