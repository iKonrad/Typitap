import {compose, applyMiddleware, createStore as reduxCreateStore } from 'redux';
import reducers from './../reducers';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux'
const middlewares = [];

// Add state logger
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-logger')());
  middlewares.push(thunkMiddleware);
}

export function createStore(state, history) {

  if (history !== undefined) {
    middlewares.push(routerMiddleware(history));
  }

  return reduxCreateStore(
    reducers,
    state,
    applyMiddleware.apply(null, middlewares)
  );
}

export let store = null;
export function getStore() { return store; }
export function setAsCurrentStore(s) {
  store = s;
  if (process.env.NODE_ENV !== 'production'
    && typeof window !== 'undefined') {
    window.store = store;
  }
}
