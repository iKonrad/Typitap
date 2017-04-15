import Constants from 'constants/gameConstants';

export const initialState = {
    started: false,
};


export default function gameReducer(state = {}, action) {
    switch (action.type) {
        case Constants.GAME_START:
            return {
                ...state,
                started: true,
            }
    }

    return state;
}

