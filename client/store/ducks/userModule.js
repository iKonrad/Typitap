const LOGIN_USER_SUCCESS = "@@user/LOGIN_USER_SUCCESS";
const LOGOUT_USER_SUCCESS = "@@user/LOGOUT_USER_SUCCESS";
const ACTIVATE_USER_SUCCESS = "@@user/ACTIVATE_USER_SUCCESS";
const ACTIVATE_USER_FAILURE = "@@user/ACTIVATE_USER_FAILURE";
const SAVE_USER_DATA = "@@user/SAVE_USER_DATA";
const UPDATE_EMAIL_SUCCESS = "@@user/UPDATE_EMAIL_SUCCESS";
const UPDATE_USER_FIELD = "@@user/UPDATE_USER_FIELD";
const SET_USER_STATS = "@@user/SET_USER_STATS";
const SET_FOLLOW_DATA = "@@user/SET_FOLLOW_DATA";
const FOLLOW_USER = "@@user/FOLLOW_USER";
const UNFOLLOW_USER = "@@user/UNFOLLOW_USER";

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
                data: {
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
        case UPDATE_EMAIL_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    Email: action.email,
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
            };
        case FOLLOW_USER:
            return {
                ...state,
                follow: {
                    ...state.follow,
                    following: [
                        ...state.follow.following,
                        {
                            id: action.id,
                            username: action.username,
                            email: action.email,
                        }
                    ]
                }
            };
        case UNFOLLOW_USER:
            return {
                ...state,
                follow: {
                    ...state.follow,
                    following: state.follow.followers.filter(obj => obj.id !== action.id),
                }
            };
    }

    return state;
}


export function loginUser(user) {
    return {
        type: LOGIN_USER_SUCCESS,
        user,
    }
}

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


export function activateUser() {
    return {type: ACTIVATE_USER_SUCCESS};
}

export function changeEmail(email) {
    return {type: UPDATE_EMAIL_SUCCESS, email};
}

export function followUser(id, username, email) {
    return {type: FOLLOW_USER, id, username, email};
}

export function unfollowUser(id) {
    return {type: UNFOLLOW_USER, id};
}