const SET_RESPONSE = "SET_RESPONSE";
const SET_CHARTS_DATA = "SET_CHARTS_DATA";
const FOLLOW_USER = "FOLLOW_USER";
const UNFOLLOW_USER = "UNFOLLOW_USER";


const initialState = {
    response: {},
    charts: {
        today: {},
        week: {},
        month: {},
        all: {}
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

