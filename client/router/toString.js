import React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {createMemoryHistory, match, RouterContext} from 'react-router'
import Helmet from 'react-helmet';
import createRoutes from './routes';
import {createStore, setAsCurrentStore} from './store';
import {syncHistoryWithStore} from 'react-router-redux'

var clientCookies;

/**
 * Handle HTTP request at Golang server
 *
 * @param   {Object}   options  request options
 * @param   {Function} cbk      response callback
 */
export default function (options, cbk) {
    cbk = global[cbk];

    let result = {
        uuid: options.uuid,
        app: null,
        title: null,
        meta: null,
        initial: null,
        error: null,
        redirect: null,
        test: null
    };

    if (typeof options.headers.Cookie == "array") {
        global.clientCookies = options.headers.Cookie[0];
    }


    var currentState = {};
    if (options.state !== undefined) {
        currentState = options.state;
    }

    console.log("AMERE");

    const memoryHistory = createMemoryHistory(options.url)
    const store = createStore(currentState, memoryHistory);
    setAsCurrentStore(store);


    try {
        match({
            routes: createRoutes({store, first: {time: false}}),
            location: options.url
        }, (error, redirectLocation, renderProps) => {
            try {


                if (error) {
                    result.error = error;

                } else if (redirectLocation) {
                    result.redirect = redirectLocation.pathname + redirectLocation.search;

                } else {


                    let {query, params} = renderProps;
                    let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
                    let promise;


                    if (typeof(comp.checkAuth) !== 'undefined') {
                        comp.checkAuth(store);
                    }


                    // Check if checkAuth function is present as well
                    if (typeof(comp.fetchData) !== 'undefined') {
                        console.log("YES");
                        promise = comp.fetchData({query, params, store});
                        promise.then(() => {
                            renderComponent();
                        });
                    } else {
                        renderComponent();
                    }


                    // Check if


                    function renderComponent() {
                        console.log("PRPS", JSON.stringify(renderProps));

                        renderProps["history"] = syncHistoryWithStore(memoryHistory, store);

                        result.app = renderToString(
                            <Provider store={store}>
                                <RouterContext {...renderProps} />
                            </Provider>
                        );
                        const {title, meta} = Helmet.rewind();


                        result.title = title.toString();
                        result.meta = meta.toString();
                        result.initial = JSON.stringify(store.getState());
                        return cbk(result);
                    }


                }

            } catch (e) {
                result.error = e;
            }

        });
    } catch (e) {
        result.error = e;
        return cbk(result);
    }
}
