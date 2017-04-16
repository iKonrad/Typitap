const START_GAME = "START_GAME";
const FINISH_GAME = "FINISH_GAME";
const UPDATE_INPUT = "UPDATE_INPUT";
const FINISH_WORD = "FINISH_WORD";
const MAKE_WORD_MISTAKE = "ERROR_WORD";
const TICK_TIME = "TICK_TIME";

const initialState = {
    text: '',
    started: false,
    currentIndex: 0,
    finished: false,
    inputValue: '',
    mistakes: {},
    time: 0,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case START_GAME:
            return {
                ...initialState,
                started: true,
                text: action.text
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
            }
        case TICK_TIME:
            return {
                ...state,
                time: state.time + 1,
            }
    }

    return state;
}

// Game Actions
export function startGame(gameText) {
    return {
        type: START_GAME,
        text: gameText
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
