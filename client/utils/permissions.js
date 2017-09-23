import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'


const Permissions = {
    /* Allow only users with first name Bob */
    OnlyAnonymous: UserAuthWrapper({
        authSelector: state => state.user,
        redirectAction: routerActions.replace,
        failureRedirectPath: '/',
        wrapperDisplayName: 'OnlyAnonymous',
        predicate: user => !user.loggedIn,
    }),
    OnlyUsers: UserAuthWrapper({
        authSelector: state => state.user,
        redirectAction: routerActions.replace,
        failureRedirectPath: '/login',
        wrapperDisplayName: 'OnlyUsers',
        predicate: user => user.loggedIn
    }),
    OnlyAdmins: UserAuthWrapper({
        authSelector: state => state.user,
        redirectAction: routerActions.replace,
        failureRedirectPath: '/',
        wrapperDisplayName: 'OnlyAdmins',
        predicate: user => user.data !== undefined && user.data.Role === "ROLE_ADMIN" || user.data.Role === "ROLE_SUPER_ADMIN",
    })
};

export default Permissions;