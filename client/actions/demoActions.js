import Constants from '../constants/demoConstants';


const Actions = {
    setConfig() {
        return (dispatch) => {

            let configs = {
                credentials: 'include',
            };

            if (typeof(global.clientCookies) !== 'undefined') {
                configs['headers'] = {
                    Cookie: global.clientCookies
                }
            }

            return fetch('/api/v1/conf', configs).then((r) => {
                return r.json();
            }).then((conf) => {
                dispatch({ type: Constants.SET_CONFIG, config: conf });
            });
        }


    }
};

export default Actions;