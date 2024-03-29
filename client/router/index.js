import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import toString from './toString';
import {Promise} from 'when';
import createRoutes from './routes';
import {createStore, setAsCurrentStore} from 'store/store';
import { syncHistoryWithStore } from 'react-router-redux'
import * as GaUtils from 'utils/gaUtils';


// import ReactWastageMonitor from 'react-wastage-monitor';

export function run() {


    require('jquery');
    require('node_modules/bootstrap/dist/js/bootstrap.bundle.js');

    window.FontAwesomeConfig = {
        searchPseudoElements: true
    }

    // Add entire styles or individual icons


    // init promise polyfill
    window.Promise = window.Promise || Promise;

    // init fetch polyfill
    window.self = window;
    require('whatwg-fetch');

    const store = createStore(window['--app-initial'], browserHistory);
    setAsCurrentStore(store);

    // if (process.env.NODE_ENV !== 'production') {
    //     ReactWastageMonitor(React, ReactDOM)
    // }

    let history = syncHistoryWithStore(browserHistory, store);

    render(
        <Provider store={store}>
            <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>{createRoutes({store, first: {time: true}})}</Router>
        </Provider>,
        document.getElementById('app')
    );

}

// Export it to render on the Golang sever, keep the name sync with -
// https://github.com/olebedev/go-starter-kit/blob/master/src/app/server/react.go#L65
export const renderToString = toString;


require('assets/scss/main.scss');
require('react-table/react-table.css');



// Style live reloading
if (module.hot) {
    let c = 0;
    module.hot.accept('assets/scss/main.scss', () => {
        require('../assets/scss/main.scss');
        const a = document.createElement('a');
        const link = document.querySelector('link[rel="stylesheet"]');
        a.href = link.href;
        a.search = '?' + c++;
        link.href = a.href;
    });
}
