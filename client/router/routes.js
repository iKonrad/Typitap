import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import App from '#app/components/app';
import Usage from '#app/components/usage';
import NotFound from '#app/components/not-found';
import Contact from 'containers/contact';
import Base from 'containers/base';
import LoginSignup from "containers/login-signup";
import Home from 'containers/home';
import Logout from 'containers/logout';

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

    return <Route path="/" component={Base}>
        <IndexRoute component={Home} onEnter={w(Home.onEnter)}/>
        <Route path="/usage" component={Usage} onEnter={w(Usage.onEnter)}/>
        <Route path="/contact" component={Contact} onEnter={w(Usage.onEnter)}/>
        <Route path="/login" component={LoginSignup} onEnter={w(LoginSignup.onEnter)}/>
        <Route path="/signup" component={LoginSignup} onEnter={w(LoginSignup.onEnter)}/>
        <Route path="/logout" component={Logout} onEnter={w(Logout.onEnter)} />

        {/* Server redirect in action */}
        <Redirect from="/docs" to="/usage"/>
        <Route path="*" component={Home} onEnter={w(Home.onEnter)}/>
    </Route>;
};



