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
        allowRedirectBack: false,
    }),
    OnlyUsers: UserAuthWrapper({
        authSelector: state => state.user,
        redirectAction: routerActions.replace,
        failureRedirectPath: '/login',
        wrapperDisplayName: 'OnlyUsers',
        predicate: user => user.loggedIn
    })
};

export default Permissions;