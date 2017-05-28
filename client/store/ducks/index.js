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

import dashboardReducer from 'scenes/Home/scenes/Dashboard/ducks/dashboardModule';
import playReducer from 'scenes/Play/ducks/playModule';

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
    play: playReducer,
});
