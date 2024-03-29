import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import Base from 'scenes/Base';
import Auth from "scenes/Auth";
import Logout from 'scenes/Auth/scenes/Logout';
import Activate from 'scenes/Auth/scenes/Activate';
import EmailChange from 'scenes/Auth/scenes/EmailChange';
import Lobby from 'scenes/Lobby';
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
import AdminText from 'scenes/Admin/scenes/AdminText';
import AdminTexts from 'scenes/Admin/scenes/AdminTexts';
import NotFound from 'scenes/Errors/NotFound';
import SubmitText from 'scenes/SubmitText';
import FAQ from 'scenes/Static/FAQ';
import Dashboard from 'scenes/Dashboard';

import Styleguide from 'scenes/Styleguide/Base';
import StyleguideHome from 'scenes/Styleguide/scenes/Home';
import StyleguideButton from 'scenes/Styleguide/scenes/components/StyleguideButton';
import StyleguideForm from 'scenes/Styleguide/scenes/components/StyleguideForm';
import StyleguideTypography from 'scenes/Styleguide/scenes/styles/StyleguideTypography';
import StyleguideColors from 'scenes/Styleguide/scenes/styles/StyleguideColors';

// Static pages
import TypingTest from 'scenes/Static/TypingTest';

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
        <Route path="/">
            <Route path="/styleguide" component={ Styleguide }>
                <IndexRoute component={StyleguideHome} onEnter={w(StyleguideHome.clientInit)} />
                <Route path="components/button" component={ StyleguideButton } onEnter={w(StyleguideButton.clientInit)}/>
                <Route path="components/form" component={ StyleguideForm } onEnter={w(StyleguideForm.clientInit)}/>
                <Route path="styles/typography" component={ StyleguideTypography } onEnter={w(StyleguideTypography.clientInit)}/>
                <Route path="styles/colors" component={ StyleguideColors } onEnter={w(StyleguideColors.clientInit)}/>
            </Route>
            <Route path="" component={Base}>
                <IndexRoute component={Lobby} onEnter={w(Lobby.clientInit)} />
                <Route path="/dashboard" component={Permissions.OnlyUsers(Dashboard)} onEnter={w(Dashboard.clientInit)} />
                <Route path="/login" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)}/>
                <Route path="/signup" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)}/>

                <Route path="/account" component={Account} >
                    <IndexRoute component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
                    <Route path="details" component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
                    <Route path="avatar" component={Permissions.OnlyUsers(AvatarSettings)} onEnter={w(AvatarSettings.clientInit)} />
                    <Route path="keyboard" component={Permissions.OnlyUsers(AccountDetails)} onEnter={w(AccountDetails.clientInit)} />
                </Route>

                <Route path="/" component={Lobby} onEnter={w(Lobby.clientInit)} />
                <Route path="/play/game" component={GameWindow} onEnter={w(GameWindow.clientInit)} />

                <Route path="/about" component={About} />
                <Route path="/terms" component={ Terms } />
                <Route path="/privacy" component={ PrivacyPolicy } />

                <Route emptyBase={true} path="/admin" component={AdminBase}>
                    <IndexRoute component={Permissions.OnlyAdmins(AdminUsers)} onEnter={w(AdminUsers.clientInit)} />
                    <Route emptyBase={true} path="users" component={Permissions.OnlyAdmins(AdminUsers)} onEnter={w(AdminUsers.clientInit)} />
                    <Route emptyBase={true} path="levels" component={Permissions.OnlyAdmins(AdminLevels)} onEnter={w(AdminLevels.clientInit)} />
                    <Route emptyBase={true} path="texts/:id" component={Permissions.OnlyAdmins(AdminText)} onEnter={w(AdminText.clientInit)} />
                    <Route emptyBase={true} path="texts" component={Permissions.OnlyAdmins(AdminTexts)} onEnter={w(AdminTexts.clientInit)} />
                </Route>

                <Route path="/submit-text" component={SubmitText} onEnter={ w(SubmitText.clientInit) } />

                <Route path="/u/:user" component={Profile} onEnter={w(Profile.clientInit)}/>
                <Route path="/u/:user/:resultId" component={Profile} onEnter={w(Profile.clientInit)}/>

                <Route path="/auth/activate/:token" emptyBase={true} component={Activate} onEnter={w(Activate.clientInit)} />
                <Route path="/auth/email/:token" component={EmailChange} onEnter={w(EmailChange.clientInit)} />
                <Route path="auth/logout" component={Logout} onEnter={w(Logout.clientInit)} />
                <Route path="/auth/password/reset/:token" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)} />
                <Route path="/auth/password/forgot" emptyBase={true} component={Permissions.OnlyAnonymous(Auth)} onEnter={w(Auth.clientInit)} />

                {/* Static pages */}
                <Route path="/typing-test" component={TypingTest} onEnter={w(TypingTest.clientInit)} />
                <Route path="/faq" component={FAQ} onEnter={w(FAQ.clientInit)} />
            </Route>

            {/* Replace with 404 */}
            <Route path="*" component={NotFound} onEnter={w(NotFound.clientInit)} />
        </Route>
    );
};



