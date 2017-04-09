import Constants from '../constants/userConstants';

export const initialState = {
    firstName: null,
    lastName: null,
    loggedIn: false,
};

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case Constants.LOGIN_USER_SUCCESS:
                return {
                    ...state,
                    ...action.user
                }
        case Constants.LOGOUT_USER_SUCCESS:
                return {
                    ...state,
                    user: {}
                };
        case Constants.SAVE_USER_DATA:
                return {
                    ...state,
                    user: {
                        ...action.data,
                        loggedIn: true
                    }
                }
    }

    return state;
}