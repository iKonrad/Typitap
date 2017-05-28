const LOGIN_USER_SUCCESS =  "LOGIN_USER_SUCCESS";
const LOGOUT_USER_SUCCESS =  "LOGOUT_USER_SUCCESS";
const ACTIVATE_USER_SUCCESS =  "ACTIVATE_USER_SUCCESS";
const ACTIVATE_USER_FAILURE =  "ACTIVATE_USER_FAILURE";
const SAVE_USER_DATA =  "SAVE_USER_DATA";
const UPDATE_USER_FIELD = "UPDATE_USER_FIELD";
const SET_USER_STATS = "SET_USER_STATS";
const SET_FOLLOW_DATA = "SET_FOLLOW_DATA";

const initialState = {
    loggedIn: false,
    data: {},
    stats: {},
    follow: {
        followers: [],
        following: [],
    },
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                data:  {
                    ...action.user
                }
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                loggedIn: false,
                data: {},
            };
        case ACTIVATE_USER_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    Active: true,
                }
            }
        case UPDATE_USER_FIELD:
            let newObj = {};
            newObj[action.key] = action.value;

            return {
                ...state,
                data: {
                    ...state.data,
                    ...newObj
                }
            };
        case SET_USER_STATS:
            return {
                ...state,
                stats: {
                    ...state.stats,
                    ...action.stats,
                }
            }
        case SET_FOLLOW_DATA:
            return {
                ...state,
                follow: {
                    ...action.follow
                }
            }
    }

    return state;
}


export function loginUser(user) {
    return (dispatch) => {
        dispatch({type: LOGIN_USER_SUCCESS, user});
    }
};

export function logoutUser() {

    return (dispatch) => {

        return fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: LOGOUT_USER_SUCCESS});
            }
        });

    }

};

export function updateUserField(key, value) {
    return {
        type: UPDATE_USER_FIELD,
        key,
        value,
    }
}

export function fetchUserStats() {

    return (dispatch) => {

        return fetch("/api/user/stats", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success && response.data !== undefined) {
                return dispatch({type: SET_USER_STATS, stats: response.data});
            }
        });
    }
}

export function fetchFollowData() {
    return (dispatch) => {

        return fetch(`/api/user/followers`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                if (response.data !== undefined && response.data !== null) {
                    return dispatch({type: SET_FOLLOW_DATA, follow: response.data});
                }
            }
        });
    }
}