const SET_RECENT_GAMES_DATA = "SET_RECENT_GAMES_DATA";
const RESET_RECENT_GAMES_DATA = "RESET_RECENT_GAMES_DATA";
const initialState = {
    games: [],
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