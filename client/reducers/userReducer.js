import Constants from '../constants/userConstants';

export const initialState = {
    name: null,
    username: null,
    email: null,
    loggedIn: false,
};

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case Constants.LOGIN_USER_SUCCESS:
                return {
                    loggedIn: true,
                    ...action.user
                };
        case Constants.LOGOUT_USER_SUCCESS:
                return {
                    loggedIn: false
                };
        case Constants.ACTIVATE_USER_SUCCESS:
                return {
                    ...state,
                    active: true,
                }
    }

    return state;
}