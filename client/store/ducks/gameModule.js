const START_GAME = "@@game/START_GAME";
const FINISH_GAME = "@@game/FINISH_GAME";
export const COMPLETE_GAME = "@@game/COMPLETE_GAME";
const UPDATE_INPUT = "@@game/UPDATE_INPUT";
const FINISH_WORD = "@@game/FINISH_WORD";
const MAKE_WORD_MISTAKE = "@@game/ERROR_WORD";
const TICK_TIME = "@@game/TICK_TIME";
const START_COUNTDOWN = "@@game/START_COUNTDOWN";
const TICK_COUNTDOWN = "@@game/TICK_COUNTDOWN";
const SET_COUNTDOWN = "@@game/SET_COUNTDOWN";
const STOP_COUNTDOWN = "@@game/STOP_COUNTDOWN";
const START_WAIT_COUNTDOWN = "@@game/START_WAIT_COUNTDOWN";
const TICK_WAIT_COUNTDOWN = "@@game/TICK_WAIT_COUNTDOWN";
const SET_WAIT_COUNTDOWN = "@@game/SET_WAIT_COUNTDOWN";
const STOP_WAIT_COUNTDOWN = "@@game/STOP_WAIT_COUNTDOWN";
const RESET_GAME = "@@game/RESET_GAME";
const START_MATCHMAKING = "@@game/START_MATCHMAKING";
const PLAYER_JOINED_ROOM = "@@game/PLAYER_JOINED_ROOM";
const PLAYER_LEFT_ROOM = "@@game/PLAYER_LEFT_ROOM";
export const JOINED_ROOM = "@@game/JOINED_ROOM";
export const LEFT_ROOM = "@@game/LEFT_ROOM";
export const UPDATE_PLAYER_DATA = "@@game/UPDATE_PLAYER_DATA";
export const UPDATE_PLAYERS_DATA = "@@game/UPDATE_PLAYERS_DATA";
export const PLAYER_COMPLETED_GAME = "@@game/PLAYER_COMPLETED_GAME";


const initialState = {
    // Game text to be typed
    text: '',

    // Bool - has the game started
    started: false,

    // Bool - Has the game finished
    finished: false,

    // Bool - Has the countdown started
    countdown: false,

    // Current word index (what's the next letter)
    currentIndex: 0,

    // Value of the input field
    inputValue: '',

    // Object with mistakes {wordIndex: mistakeCount}
    mistakes: {},

    // Game time
    time: 0,

    // How many seconds in countdown is remaining
    countdownSeconds: 5,

    // Online only - has the countdown for players started
    waitCountdown: false,

    // Online only - countdown seconds for players
    waitCountdownSeconds: 10,

    // Timestamp of the time when game started
    startedTimestamp: 0,

    // Playback data
    /*
     Playback object:
     t: time delta
     a: action (n - new character, d - deleted character(
     v: value (character added)
     c: cursor offset from right side (0 - added on end, 1 - second from right etc)
     */
    playback: [],

    // Bool - is the game online
    online: false,

    // How many points have been awarded for completing the game (only after the game is finished)
    points: 0,

    // Final wpm (only after the game is finished)
    wpm: 0,

    // Final accuracy (only after the game is finished)
    accuracy: 0,

    // Online only - room data
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

            let startTime = +new Date();

            return {
                ...state,
                started: true,
                starting: false,
                countdown: false,
                online: action.online,
                startedTimestamp: startTime,
                playback: [
                    ...state.playback,
                    {
                        t: 0,
                        a: "start"
                    }
                ]
            };
        case START_MATCHMAKING:
            return {
                ...state,
                online: true,
            }
        case UPDATE_INPUT:

            let time = +new Date();
            let t = time - state.startedTimestamp;

            let a = "n";
            if (action.value.length < state.inputValue.length) {
                a = "d";
            }

            let c = 0;
            let v = "";

            for (let i = 0; i < action.value.length; i++) {
                if (action.value[i] !== state.inputValue[i]) {
                    c = action.value.length - i;
                    if ( a !== "d") {
                        c--;
                    }
                    v = action.value[i];
                    break;
                }
            }

            return {
                ...state,
                inputValue: action.value,
                playback: [
                    ...state.playback,
                    {
                        t,
                        a,
                        v,
                        c
                    }
                ]
            };
        case FINISH_WORD:

            time = +new Date();
            t = time - state.startedTimestamp;

            return {
                ...state,
                inputValue: '',
                currentIndex: state.currentIndex + 1,
                playback: [
                    ...state.playback,
                    {
                        a: "w",
                        t
                    }
                ]
            };
        case JOINED_ROOM:

            Object.keys(action.players).forEach((i) => {
                if (typeof action.players[i].completed === "string") {
                    action.players[i].completed = action.players[i].completed === "1"
                }
            });

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

            action.player.completed = false;
            action.player.left = false;
            players[action.player.identifier] = action.player;

            return {
                ...state,
                room: {
                    ...state.room,
                    players
                }
            };
        case PLAYER_LEFT_ROOM:
            /*
                If game has started, we'll mark player as "left" instead of removing it
                Otherwise, remove player from the list
             */
            if (state.started || state.countdown) {
                players = state.room.players;
                players[action.identifier].left = true;

                return {
                    ...state,
                    room: {
                        ...state.room,
                        players: {
                            ...state.players,
                            ...players,
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    room: {
                        ...state.room,
                        players: Object.filter(state.room.players, player => player.identifier !== action.identifier)
                    }
                };
            }

        case UPDATE_PLAYERS_DATA:

            let room = {
                ...state.room
            };

            Object.keys(action.players).forEach((i) => {
                let obj = action.players[i];
                room.players[i].score = obj.score;
                let completed = obj.completed !== undefined ? obj.completed : false;
                room.players[i].completed = typeof completed === "string" ? completed === "1" : completed;
             });

            return {
                ...state,
                room
            }
        case LEFT_ROOM:
            return {
                ...state,
                room: {}
            };
        case FINISH_GAME:
            time = +new Date();
            t = time - state.startedTimestamp;
            return {
                ...state,
                finished: true,
                wpm: action.wpm,
                accuracy: action.accuracy,
                points: action.points,
                inputValue: '',
                playback: [
                    ...state.playback,
                    {
                        a: "end",
                        t
                    }
                ]
            };
        case PLAYER_COMPLETED_GAME:

            players = {
                ...state.room.players,
            };

            players[action.identifier] = {
                ...state.room.players[action.identifier],
                completed: true,
                place: action.place
            };

            return {
                ...state,
                room: {
                    ...state.room,
                    players
                }
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
                countdownSeconds: action.seconds !== undefined ? action.seconds : initialState.countdownSeconds
            }
        case TICK_COUNTDOWN:
            return {
                ...state,
                countdownSeconds: state.countdownSeconds - 1
            }
        case SET_COUNTDOWN:
            return {
                ...state,
                countdownSeconds: action.seconds,
            }
        case STOP_COUNTDOWN:
            return {
                ...state,
                countdown: false,
                countdownSeconds: 0,
            }
        case START_WAIT_COUNTDOWN:
            return {
                ...state,
                waitCountdown: true,
                waitCountdownSeconds: action.seconds !== undefined ? action.seconds : initialState.waitCountdownSeconds
            }
        case TICK_WAIT_COUNTDOWN:
            return {
                ...state,
                waitCountdownSeconds: state.waitCountdownSeconds - 1
            }
        case SET_WAIT_COUNTDOWN:
            return {
                ...state,
                waitCountdownSeconds: action.seconds,
            }
        case STOP_WAIT_COUNTDOWN:
            return {
                ...state,
                waitCountdown: false,
                waitCountdownSeconds: 0,
            }
        case RESET_GAME:
            return {
                ...state,
                ...initialState
            }

    }

    return state;
}



// Game Actions
export function
startGame(online) {
    return {
        type: START_GAME,
        online,
    };
}

export function finishGame(wpm, accuracy, points) {
    return {
        type: FINISH_GAME,
        wpm,
        accuracy,
        points,
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

export function startCountdown(seconds) {
    return {
        type: START_COUNTDOWN,
        seconds
    }
}

export function tickCountdown() {
    return {
        type: TICK_COUNTDOWN
    }
}

export function setCountdown(seconds) {
    return {
        type: SET_COUNTDOWN,
        seconds
    }
}

export function stopCountdown() {
    return {
        type: STOP_COUNTDOWN
    }
}


export function startWaitCountdown(seconds) {
    return {
        type: START_WAIT_COUNTDOWN,
        seconds
    }
}

export function tickWaitCountdown() {
    return {
        type: TICK_WAIT_COUNTDOWN
    }
}

export function setWaitCountdown(seconds) {
    return {
        type: SET_WAIT_COUNTDOWN,
        seconds
    }
}

export function stopWaitCountdown() {
    return {
        type: STOP_WAIT_COUNTDOWN
    }
}




export function resetGame() {
    return {
        type: RESET_GAME
    }
}


export function startMatchmaking() {
    return {
        type: START_MATCHMAKING
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

export function updatePlayersData(players) {
    return { type: UPDATE_PLAYERS_DATA,  players}
}

export function updatePlayerData(score) {
    return { type: UPDATE_PLAYER_DATA,  score}
}

export function setPlayerCompleted(identifier, place) {
    return { type: PLAYER_COMPLETED_GAME, identifier, place};
}

export function completeGame() {
    return { type: COMPLETE_GAME };
}