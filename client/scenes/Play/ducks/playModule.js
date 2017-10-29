export const SET_GLOBAL_FEED = "@@play/SET_GLOBAL_FEED";
export const SHOW_LANGUAGE_SWITCHER = "@@play/SHOW_LANGUAGE_SWITCHER";

const initialState = {
    feed: [],
    showLanguageSwitcher: false,
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
        case SHOW_LANGUAGE_SWITCHER:
            return {
                ...state,
                showLanguageSwitcher: true,
            }
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

export function showLanguageSwitcher() {
    return {type: SHOW_LANGUAGE_SWITCHER}
}