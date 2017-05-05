import {compose, applyMiddleware, createStore as reduxCreateStore} from 'redux';
import reducers from './modules';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux'
import socketMiddleware from "./middlewares/socketMiddleware";
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

    // Add state logger
    if (typeof window !== 'undefined') {
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
            typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
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
