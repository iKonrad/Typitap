import Constants from '../constants/demoConstants';


export const initialState = {};

export default function demoReducer(state = {}, action) {
    switch (action.type) {
        case Constants.SET_CONFIG:
            return action.config;
    }

    return state;
}