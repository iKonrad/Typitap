const SET_GLOBAL_FEED = "SET_GLOBAL_FEED";

const initialState = {
    feed: [],
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_GLOBAL_FEED:
            return {
                ...state,
                feed: [
                    ...action.feed
                ]
            };
    }
    return state;
}



export function fetchGlobalFeed() {
    return (dispatch) => {
        return fetch("/api/game/feed", {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: SET_GLOBAL_FEED, feed: response.data.Items});
            }
        })
    }
}

