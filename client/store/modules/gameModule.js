const START_GAME = "@@game/START_GAME";
const FINISH_GAME = "@@game/FINISH_GAME";
const UPDATE_INPUT = "@@game/UPDATE_INPUT";
const FINISH_WORD = "@@game/FINISH_WORD";
const MAKE_WORD_MISTAKE = "@@game/ERROR_WORD";
const TICK_TIME = "@@game/TICK_TIME";
const START_COUNTDOWN = "@@game/START_COUNTDOWN";
const TICK_COUNTDOWN = "@@game/TICK_COUNTDOWN";
const RESET_GAME = "@@game/RESET_GAME";
const START_ONLINE_SEARCH = "@@game/START_ONLINE_SEARCH";
const PLAYER_JOINED_ROOM = "@@game/PLAYER_JOINED_ROOM";
const PLAYER_LEFT_ROOM = "@@game/PLAYER_LEFT_ROOM";
export const JOINED_ROOM = "@@game/JOINED_ROOM";
export const LEFT_ROOM = "@@game/LEFT_ROOM";


const initialState = {
    text: '',
    started: false,
    currentIndex: 0,
    finished: false,
    inputValue: '',
    mistakes: {},
    time: 0,
    countdown: false,
    countdownSeconds: 5,
    online: false,
    room: {
        id: '',
        players: {},
    },
};


export default function reducer(state = initialState, action) {

    Object.filter = (obj, predicate) =>
        Object.keys(obj)
            .filter( key => predicate(obj[key]) )
            .reduce( (res, key) => (res[key] = obj[key], res), {} );

    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                started: true,
                countdown: false,
                online: action.online,
            };
        case START_ONLINE_SEARCH:
            return {
                ...state,
                online: true,
            }
        case UPDATE_INPUT:
            return {
                ...state,
                inputValue: action.value
            };
        case FINISH_WORD:
            return {
                ...state,
                inputValue: '',
                currentIndex: state.currentIndex + 1,
            };
        case JOINED_ROOM:
            return {
                ...state,
                text: action.text,
                room: {
                    id: action.roomId,
                    players: action.players,
                }
            };
        case PLAYER_JOINED_ROOM:

            // Check if player doesn't already exists
            if (state.room.players[action.player.identifier] !== undefined) {
                return state;
            }

            // Otherwise, add player to the room
            let players = {
                ...state.room.players,
            };

            players[action.player.identifier] = action.player;

            return {
                ...state,
                room: {
                    ...state.room,
                    players
                }
            };
        case PLAYER_LEFT_ROOM:
            return {
                ...state,
                room: {
                    ...state.room,
                    players: Object.filter(state.room.players, player => player.identifier !== action.identifier)
                }
            };
        case LEFT_ROOM:
            return {
                ...state,
                room: {}
            };
        case FINISH_GAME:
            return {
                ...state,
                finished: true,
                inputValue: '',
            };
        case MAKE_WORD_MISTAKE:
            let currentMistakes = 0;

            if (state.mistakes[state.currentIndex + ""] !== undefined) {
                currentMistakes = state.mistakes[state.currentIndex + ""];
            }

            currentMistakes++;
            let mistakes = {
                ...state.mistakes
            };

            mistakes[state.currentIndex + ""] = currentMistakes;

            return {
                ...state,
                mistakes
            };
        case TICK_TIME:
            return {
                ...state,
                time: state.time + 1,
            }
        case START_COUNTDOWN:
            return {
                ...state,
                countdown: true,
                countdownSeconds: initialState.countdownSeconds
            }
        case TICK_COUNTDOWN:
            return {
                ...state,
                countdownSeconds: state.countdownSeconds - 1
            }
        case RESET_GAME:
            return initialState

    }

    return state;
}



// Game Actions
export function startGame(online) {
    return {
        type: START_GAME,
        online,
    };
}

export function finishGame() {
    return {
        type: FINISH_GAME
    }
}

export function updateInput(value) {
    return {
        type: UPDATE_INPUT,
        value
    }
}

export function finishWord() {
    return {
        type: FINISH_WORD
    };
}

export function makeMistake() {
    return {
        type: MAKE_WORD_MISTAKE
    }
}

export function tickTime() {
    return {
        type: TICK_TIME
    }
}

export function startCountdown() {
    return {
        type: START_COUNTDOWN
    }
}

export function tickCountdown() {
    return {
        type: TICK_COUNTDOWN
    }
}

export function resetGame() {
    return {
        type: RESET_GAME
    }
}


export function startOnlineSearch() {
    return {
        type: START_ONLINE_SEARCH
    }
}

export function joinedRoom(roomId, players, text) {

    if (players === undefined) {
        players = {};
    }

    return {
        type: JOINED_ROOM,
        roomId,
        players,
        text
    }

}

export function leftRoom() {
    return {type: LEFT_ROOM}
}

export function playerJoinedRoom(player) {
    return {type: PLAYER_JOINED_ROOM, player}
}

export function playerLeftRoom(identifier) {
    return {type: PLAYER_LEFT_ROOM, identifier}
}