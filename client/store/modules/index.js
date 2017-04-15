import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import {reducer as notificationsReducer} from 'react-notification-system-redux';
import appReducer from './appModule';
import userReducer from './userModule';
import gameReducer from './gameModule';




// Combine all reducers you may have here
export default combineReducers({
    app: appReducer,
    user: userReducer,
    form: formReducer,
    game: gameReducer,
    routing: routerReducer,
    notifications: notificationsReducer,
});
