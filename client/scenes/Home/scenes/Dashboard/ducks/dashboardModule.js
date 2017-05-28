const SET_RECENT_GAMES_DATA = "SET_RECENT_GAMES_DATA";
const RESET_RECENT_GAMES_DATA = "RESET_RECENT_GAMES_DATA";
const SET_ACTIVITY_FEED = "SET_ACTIVITY_FEED";
const RESET_ACTIVITY_FEED = "RESET_ACTIVITY_FEED";


const initialState = {
    games: [],
    feed: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_RECENT_GAMES_DATA:
            return {
                ...state,
                games: [
                    ...state.games,
                    ...action.games,
                ],
            }
        case RESET_RECENT_GAMES_DATA:
            return {
                ...state,
                games: [],
            }
        case SET_ACTIVITY_FEED:
            return {
                ...state,
                feed: [
                    ...state.feed,
                    ...action.feed,
                ]
            }
        case RESET_ACTIVITY_FEED:
            return {
                ...state,
                feed: [],
            }
    }

    return state;
}


export function getRecentGames(offset) {

    return (dispatch) => {

        return fetch(`/api/user/results?offset=${offset}`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                if (response.data !== undefined && response.data !== null) {
                    return dispatch({type: SET_RECENT_GAMES_DATA, games: response.data});
                }
            }
        });
    }
}

export function resetRecentGames() {
    return {
        type: RESET_RECENT_GAMES_DATA
    }
}

export function fetchActivityFeed(offset) {

    return (dispatch) => {

        return fetch(`/api/user/feed?offset=${offset}`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                if (response.data !== undefined && response.data !== null) {
                    return dispatch({type: SET_ACTIVITY_FEED, feed: response.data.Items});
                }
            }
        });
    }

}

export function resetActivityFeed() {
    return {
        type: RESET_ACTIVITY_FEED
    }
}

