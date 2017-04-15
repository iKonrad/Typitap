const GAME_START = "GAME_START";


export default function reducer(state = {}, action) {
    switch (action.type) {
        case GAME_START:
            return {
                ...state,
                started: true,
            }
    }

    return state;
}

export function startGame() {
    return {type: GAME_START};
}