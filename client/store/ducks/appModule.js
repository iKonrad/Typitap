// export const SET_RESPONSE = "@@app/SET_RESPONSE";
export const SET_CHARTS_DATA = "@@app/SET_CHARTS_DATA";
export const FOLLOW_USER = "@@app/FOLLOW_USER";
export const UNFOLLOW_USER = "@@app/UNFOLLOW_USER";
export const OPEN_ONLINE_SIDEBAR = "@@app/OPEN_ONLINE_SIDEBAR";
export const CLOSE_ONLINE_SIDEBAR = "@@app/CLOSE_ONLINE_SIDEBAR";
export const SET_RESPONSE = "@app/SET_RESPONSE";

// Online Room constants
export const ONLINE_ROOM_PLAYERS_SET = "@app/ONLINE_ROOM_PLAYERS_SET";
export const ONLINE_ROOM_COUNTDOWN_STARTED = "@app/ONLINE_ROOM_COUNTDOWN_STARTED";
export const ONLINE_ROOM_COUNTDOWN_STOPPED = "@app/ONLINE_ROOM_COUNTDOWN_STOPPED";
export const ONLINE_ROOM_COUNTDOWN_SET_SECONDS = "@app/ONLINE_ROOM_COUNTDOWN_SET_SECONDS";
export const ONLINE_ROOM_RESET = "@app/ONLINE_ROOM_RESET";

const initialState = {
    response: {},
    charts: {
        today: {},
        week: {},
        month: {},
        all: {}
    },

    // Contains state of the online sidebar
    onlineSidebarOpen: false,

    // Contains data of the online room (before joining)
    onlineRoom: {
        id: '',
        players: {},
        waitCountdown: false,
        waitCountdownSeconds: 10,
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
        case OPEN_ONLINE_SIDEBAR:
            return {
                ...state,
                onlineSidebarOpen: true,
            };
        case CLOSE_ONLINE_SIDEBAR:
            return {
                ...state,
                onlineSidebarOpen: false,
            };
        case ONLINE_ROOM_PLAYERS_SET:
            return {
                ...state,
                onlineRoom: {
                    ...state.onlineRoom,
                    players: {
                        ...action.players
                    }
                }
            };
        case ONLINE_ROOM_COUNTDOWN_STARTED:
            return {
                ...state,
                onlineRoom: {
                    ...state.onlineRoom,
                    waitCountdown: true,
                }
            };
        case ONLINE_ROOM_COUNTDOWN_STOPPED:
            return {
                ...state,
                onlineRoom: {
                    ...state.onlineRoom,
                    waitCountdown: false,
                    waitCountdownSeconds: initialState.onlineRoom.waitCountdownSeconds
                }
            };
        case ONLINE_ROOM_COUNTDOWN_SET_SECONDS:
            return {
                ...state,
                onlineRoom: {
                    ...state.onlineRoom,
                    waitCountdown: true,
                    waitCountdownSeconds: action.countdownSeconds
                }
            };
        case ONLINE_ROOM_RESET:
            return {
                ...state,
                onlineRoom: {
                    ...state.onlineRoom,
                    ...initialState.onlineRoom
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

export function openOnlineSidebar() {
    return {type: OPEN_ONLINE_SIDEBAR}
}

export function closeOnlineSidebar() {
    return {type: CLOSE_ONLINE_SIDEBAR}
}

export function setOnlineRoomPlayers(players) {
    return {type: ONLINE_ROOM_PLAYERS_SET, players}
}

export function setOnlineRoomCountdownStarted() {
    return {type: ONLINE_ROOM_COUNTDOWN_STARTED}
}

export function setOnlineRoomCountdownStopped() {
    return {type: ONLINE_ROOM_COUNTDOWN_STOPPED}
}

export function setOnlineRoomCountdownSeconds(countdownSeconds) {
    return {type: ONLINE_ROOM_COUNTDOWN_SET_SECONDS, countdownSeconds}
}

export function resetOnlineRoom() {
    return {type: ONLINE_ROOM_RESET}
}