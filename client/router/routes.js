import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import Base from 'scenes/base';
import Auth from "scenes/Auth";
import Home from 'scenes/Home';
import Logout from 'scenes/Auth/scenes/Logout';
import Activate from 'scenes/Auth/scenes/Activate';
import Play from 'scenes/Play';
import GameWindow from 'scenes/Game';

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
            <Route path="/login" component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.onEnter)}/>
            <Route path="/signup" component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.onEnter)}/>
            <Route path="/auth/password/reset/:token" component={Permissions.OnlyAnonymous(Auth)}
                   onEnter={w(Auth.onEnter)}/>
            <Route path="/auth/password/forgot" component={Permissions.OnlyAnonymous(Auth)}
                   onEnter={w(Auth.onEnter)}/>

            <Route path="/play" component={Play} onEnter={w(Play.onEnter)}/>
            <Route path="/play/:type" component={GameWindow} onEnter={w(GameWindow.onEnter)}/>

            <Route path="/auth/activate/:token" component={Activate} onEnter={w(Activate.onEnter)}/>
            <Route path="auth/logout" component={Logout} onEnter={w(Logout.onEnter)}/>
            {/* Replace with 404 */}
            <Route path="*" component={Home} onEnter={w(Home.onEnter)}/>
        </Route>
    );
};



