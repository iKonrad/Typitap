import Constants from "./../constants/appConstants";

export const initialState = {
    websocket: {}
};

export default function appReducer(state = {}, action) {
    switch (action.type) {
        case Constants.CONNECT_WEBSOCKET:
            return {
            ...state,
            websocket: action.websocket
        }
        case Constants.SET_RESPONSE:
            return {
                ...state,
                response: action.payload
            }
    }

    return state;
}