const SET_RECENT_GAMES_DATA = "SET_RECENT_GAMES_DATA";

const initialState = {
    games: [],
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_RECENT_GAMES_DATA:
            return {
                ...state,
                games: action.games,
            }
    }

    return state;
}


export function getRecentGames() {

    return (dispatch) => {

        return fetch("/api/user/results", {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: SET_RECENT_GAMES_DATA, games: response.data});
            }
        });
    }
}