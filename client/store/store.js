import {compose, applyMiddleware, createStore as reduxCreateStore} from 'redux';
import reducers from './ducks';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux'
import socketMiddleware from "./middlewares/socketMiddleware";
import gaMiddleware from './middlewares/gaMiddleware';

import { createLogger } from 'redux-logger'
const middlewares = [];




export function createStore(state, history) {

    if (history !== undefined) {
        middlewares.push(routerMiddleware(history));
    }

    // Add thunk middleware
    middlewares.push(thunkMiddleware);

    // Add socket middleware
    middlewares.push(socketMiddleware);

    // Add google analytics middleware
    middlewares.push(gaMiddleware);

    // Add state logger
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        middlewares.push(createLogger({
            duration: true,
            diff: true,
            collapsed: true,
        }));
    }

    return reduxCreateStore(
        reducers,
        state,
        compose(
            applyMiddleware.apply(null, middlewares),
            process.env.NODE_ENV !== 'production' && typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
        )
    );
}

export let store = null;
export function getStore() {
    return store;
}
export function setAsCurrentStore(s) {
    store = s;
    if (process.env.NODE_ENV !== 'production'
        && typeof window !== 'undefined') {
        window.store = store;
    }
}
