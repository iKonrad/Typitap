import React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import Helmet from 'react-helmet';
import createRoutes from './routes';
import {createStore, setAsCurrentStore} from './store';
import cookie from 'react-cookie';

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


    global.clientCookies = options.headers.Cookie[0];


    const store = createStore();
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
                        promise = comp.fetchData({query, params, store});
                        promise.then(() => {
                            renderComponent();
                        });
                    } else {
                        renderComponent();
                    }


                    // Check if


                    function renderComponent() {
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
