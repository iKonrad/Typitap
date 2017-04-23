const START_GAME = "START_GAME";
const FINISH_GAME = "FINISH_GAME";
const UPDATE_INPUT = "UPDATE_INPUT";
const FINISH_WORD = "FINISH_WORD";
const MAKE_WORD_MISTAKE = "ERROR_WORD";
const TICK_TIME = "TICK_TIME";
const START_COUNTDOWN = "START_COUNTDOWN";
const TICK_COUNTDOWN = "TICK_COUNTDOWN";
const RESET_GAME = "RESET_GAME";
const FIND_SESSION = "FIND_SESSION";
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
    sessionId: "",
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case START_GAME:
            return {
                ...initialState,
                started: true,
                text: action.text,
                countdown: false,
                online: action.online,
                sessionId: action.sessionId
            };
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




export function getSession(online) {

    let isOnline = online ? "online" : "offline";

    return (dispatch) => {
        return fetch("/api/game/session/" + isOnline, {
            credentials: "same-origin",
        }).then((response) => {
            return response.json();
        }).then((response) => {
            return response;
        });
    }


}

// Game Actions
export function startGame(gameText, online, sessionId) {
    return {
        type: START_GAME,
        text: gameText,
        online,
        sessionId
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


export function findSession() {
    return {
        type: FIND_SESSION
    }
}