import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux';
import {reducer as notificationsReducer} from 'reapop';
import appReducer from './appModule';
import userReducer from './userModule';
import gameReducer from './gameModule';
import socketReducer from './socketModule';
import accountReducer from './accountModule';
import profileReducer from './profileModule';

import dashboardReducer from 'scenes/Dashboard/ducks/dashboardModule';
import playReducer from 'scenes/Lobby/ducks/lobbyModule';
import adminTextReducer from 'scenes/Admin/scenes/AdminText/ducks/adminTextModule';
import submitTextReducer from 'scenes/SubmitText/ducks/submitTextModule';

// Combine all reducers you may have here
export default combineReducers({
    app: appReducer,
    user: userReducer,
    form: formReducer,
    game: gameReducer,
    dashboard: dashboardReducer,
    routing: routerReducer,
    notifications: notificationsReducer(),
    socket: socketReducer,
    account: accountReducer,
    profile: profileReducer,
    lobby: playReducer,
    adminText: adminTextReducer,
    submitText: submitTextReducer,
});
