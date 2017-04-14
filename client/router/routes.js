import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import Base from 'containers/base';
import LoginSignup from "containers/login-signup";
import Home from 'containers/home';
import Logout from 'containers/logout';
import Activate from 'containers/activate';
import GameWindow from 'containers/game-window';

import Permissions from 'utils/permissions';

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
export default ({store, first}) => {

    // Make a closure to skip first request
    function w(loader) {
        return (nextState, replaceState, callback) => {
            if (first.time) {
                first.time = false;
                return callback();
            }
            return loader ? loader({store, nextState, replaceState, callback}) : callback();
        };
    }


    return (
        <Route path="/" component={Base}>
            <IndexRoute component={Home} onEnter={w(Home.onEnter)}/>
            <Route path="/login" component={Permissions.OnlyAnonymous(LoginSignup)} onEnter={w(LoginSignup.onEnter)}/>
            <Route path="/signup" component={Permissions.OnlyAnonymous(LoginSignup)} onEnter={w(LoginSignup.onEnter)}/>
            <Route path="/auth/password/reset/:token" component={Permissions.OnlyAnonymous(LoginSignup)}
                   onEnter={w(LoginSignup.onEnter)}/>
            <Route path="/auth/password/forgot" component={Permissions.OnlyAnonymous(LoginSignup)}
                   onEnter={w(LoginSignup.onEnter)}/>

            <Route path="/play" component={GameWindow} onEnter={w(GameWindow.onEnter)}/>

            <Route path="/auth/activate/:token" component={Activate} onEnter={w(Activate.onEnter)}/>
            <Route path="auth/logout" component={Logout} onEnter={w(Logout.onEnter)}/>
            {/* Replace with 404 */}
            <Route path="*" component={Home} onEnter={w(Home.onEnter)}/>
        </Route>
    );
};



