import React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router'
import Helmet from 'react-helmet';
import createRoutes from './routes';
import {createStore, setAsCurrentStore} from 'store/store';
import * as AppActions from 'store/ducks/appModule';


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

    if (typeof options.headers.Cookie === "object" || typeof options.headers.Cookie === "array") {
        global.clientCookies = options.headers.Cookie[0];
    }

    var currentState = {};
    if (options.state !== undefined && options.state !== null) {
        currentState = options.state;
    }

    // const memoryHistory = createMemoryHistory(options.url)
    const store = createStore(currentState, null);
    setAsCurrentStore(store);

    let responseData = [];

    if (options.response !== undefined) {
        store.dispatch(AppActions.setResponse(options.response));
    }

    try {
        let routes = createRoutes({store, first: {time: false}});
        match({
            routes: routes,
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

                    // Check if checkAuth function is present as well
                    if (comp !== undefined && typeof comp.serverInit !== "undefined") {

                        promise = comp.serverInit(responseData, params, store);
                        switch (typeof promise) {
                            case "undefined":

                                renderComponent();
                                break;
                            case "object":
                                if (Object.prototype.toString.call( promise ) === '[object Array]') {
                                    let resolved = 0;
                                    promise.forEach((pro) => {
                                        pro.then(() => {
                                            resolved++;
                                            if (resolved === promise.length) {
                                                renderComponent();
                                            }
                                        })
                                    });
                                }
                                break;
                        }
                    } else {
                        renderComponent();
                    }

                    function renderComponent() {
                        // renderProps["history"] = syncHistoryWithStore(memoryHistory, store);
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
