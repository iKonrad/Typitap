const SET_RESPONSE = "SET_RESPONSE";
const SET_CHARTS_DATA = "SET_CHARTS_DATA";
const SET_USER_PROFILE_DATA = "SET_USER_PROFILE_DATA";
const FETCH_USER_PROFILE_DATA = "FETCH_USER_PROFILE_DATA";

const initialState = {
    response: {},
    charts: {
        today: {},
        week: {},
        month: {},
        all: {}
    },
    profile: {
        user: {},
        fetching: false,
        follow: {
            followers: [],
            following: [],
        }
    },
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_RESPONSE:
            return {
                ...state,
                response: action.payload
            }
        case SET_CHARTS_DATA:
            return {
                ...state,
                charts: {
                    ...action.charts
                }
            };
        case FETCH_USER_PROFILE_DATA:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    fetching: true,
                }
            }
        case SET_USER_PROFILE_DATA:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    ...action.profile,
                    fetching: false,
                }
            }
    }
    return state;
}



export function setResponse(response) {
    if (!response || response === undefined || response === null) {
        response = {};
    }
    return {type: SET_RESPONSE, payload: response};
}

export function fetchChartsData() {
    return (dispatch) => {
        return fetch("/api/game/charts", {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: SET_CHARTS_DATA, charts: response.data});
            }
        })

    }
}


export function startLoadingUserProfile() {
    return {type: FETCH_USER_PROFILE_DATA}
}

export function fetchUserProfile(username) {
    return (dispatch) => {
        return fetch("/api/user/profile/" + username, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: SET_USER_PROFILE_DATA, profile: response.data});
            }
        })

    }
}