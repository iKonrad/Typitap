import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import {reducer as notificationsReducer} from 'react-notification-system-redux';
import appReducer from 'reducers/appReducer';
import demoReducer from 'reducers/demoReducer';
import userReducer from 'reducers/userReducer';
import gameReducer from 'reducers/gameReducer';
import { initialState as appState } from 'reducers/appReducer';
import { initialState as demoState } from 'reducers/demoReducer';
import { initialState as userState } from 'reducers/userReducer';



// Combine all reducers you may have here
export default combineReducers({
    app: appReducer,
    demo: demoReducer,
    user: userReducer,
    form: formReducer,
    game: gameReducer,
    routing: routerReducer,
    notifications: notificationsReducer,
});

export const initialStates = {
    appState,
    demoState,
    userState,
};
