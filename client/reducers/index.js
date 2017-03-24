import { combineReducers } from 'redux';


import appReducer from 'reducers/appReducer';
import demoReducer from 'reducers/demoReducer';

import { initialState as appState } from 'reducers/appReducer';
import { initialState as demoState } from 'reducers/demoReducer';


// Combine all reducers you may have here
export default combineReducers({
    app: appReducer,
    demo: demoReducer
});

export const initialStates = {
    appState,
    demoState
};
