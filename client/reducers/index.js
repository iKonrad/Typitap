import { combineReducers } from 'redux';


import appReducer from 'reducers/appReducer';
import demoReducer from 'reducers/demoReducer';
import userReducer from 'reducers/userReducer';

import { initialState as appState } from 'reducers/appReducer';
import { initialState as demoState } from 'reducers/demoReducer';
import { initialState as userState } from 'reducers/userReducer';


// Combine all reducers you may have here
export default combineReducers({
    app: appReducer,
    demo: demoReducer,
    user: userReducer
});

export const initialStates = {
    appState,
    demoState,
    userState
};
