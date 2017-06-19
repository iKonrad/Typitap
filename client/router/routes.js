import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import Base from 'scenes/Base';
import Auth from "scenes/Auth";
import Home from 'scenes/Home';
import Logout from 'scenes/Auth/scenes/Logout';
import Activate from 'scenes/Auth/scenes/Activate';
import EmailChange from 'scenes/Auth/scenes/EmailChange';
import Play from 'scenes/Play';
import GameWindow from 'scenes/Game';
import Account from 'scenes/Account';
import AccountDetails from 'scenes/Account/scenes/AccountDetails';
import AvatarSettings from 'scenes/Account/scenes/AvatarSettings';
import Profile from 'scenes/Profile';
import Permissions from 'utils/permissions';
import AdminBase from 'scenes/Admin';
import AdminUsers from 'scenes/Admin/scenes/AdminUsers';
import AdminLevels from 'scenes/Admin/scenes/AdminLevels';
import About from 'scenes/About';
import Terms from 'scenes/Terms';
import PrivacyPolicy from 'scenes/PrivacyPolicy';

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
            <IndexRoute component={Home} onEnter={w(Home.clientInit)} />
            <Route path="/login" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)}/>
            <Route path="/signup" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)}/>

            <Route path="/account" component={Account} >
                <IndexRoute component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
                <Route path="details" component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
                <Route path="avatar" component={Permissions.OnlyUsers(AvatarSettings)} onEnter={w(AvatarSettings.clientInit)} />
                <Route path="keyboard" component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
            </Route>

            <Route path="/play" component={Play} onEnter={w(Play.clientInit)} />
            <Route path="/play/:type" component={GameWindow} onEnter={w(GameWindow.clientInit)} />

            <Route path="/about" component={About} />
            <Route path="/terms" component={ Terms } />
            <Route path="/privacy" component={ PrivacyPolicy } />

            <Route emptyBase={true} path="/admin" component={AdminBase}>
                <IndexRoute component={Permissions.OnlyAdmins(AdminUsers)} onEnter={w(AdminUsers.clientInit)} />
                <Route emptyBase={true} path="users" component={Permissions.OnlyAdmins(AdminUsers)} onEnter={w(AdminUsers.clientInit)} />
                <Route emptyBase={true} path="levels" component={Permissions.OnlyAdmins(AdminLevels)} onEnter={w(AdminLevels.clientInit)} />
            </Route>


            <Route path="/u/:user" component={Profile} onEnter={w(Profile.clientInit)}/>

            <Route path="/auth/activate/:token" emptyBase={true} component={Activate} onEnter={w(Activate.clientInit)} />
            <Route path="/auth/email/:token" component={EmailChange} onEnter={w(EmailChange.clientInit)} />
            <Route path="auth/logout" component={Logout} onEnter={w(Logout.clientInit)} />
            <Route path="/auth/password/reset/:token" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)} />
            <Route path="/auth/password/forgot" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)} />

            {/* Replace with 404 */}
            <Route path="*" component={Home} />
        </Route>
    );
};



