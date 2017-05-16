import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import Base from 'scenes/base';
import Auth from "scenes/Auth";
import Home from 'scenes/Home';
import Logout from 'scenes/Auth/scenes/Logout';
import Activate from 'scenes/Auth/scenes/Activate';
import Play from 'scenes/Play';
import GameWindow from 'scenes/Game';
import Account from 'scenes/Account';
import AccountDetails from 'scenes/Account/scenes/AccountDetails';

import Permissions from 'utils/permissions';

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
export default ({store, first}) => {

    return (
        <Route path="/" component={Base}>
            <IndexRoute component={Home} />
            <Route path="/login" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} />
            <Route path="/signup" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} />

            <Route path="/account" component={Account}>
                <IndexRoute component={Permissions.OnlyUsers(AccountDetails)} />
                <Route path="details" component={Permissions.OnlyUsers(AccountDetails)}/>
                <Route path="avatar" component={Permissions.OnlyUsers(AccountDetails)}/>
                <Route path="keyboard" component={Permissions.OnlyUsers(AccountDetails)}/>
            </Route>

            <Route path="/play" component={Play} />
            <Route path="/play/:type" component={GameWindow} />

            <Route path="/auth/activate/:token" emptyBase={true} component={Activate} />
            <Route path="auth/logout" component={Logout} />
            <Route path="/auth/password/reset/:token" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)}/>
            <Route path="/auth/password/forgot" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)}/>


            {/* Replace with 404 */}
            <Route path="*" component={Home} />
        </Route>
    );
};



