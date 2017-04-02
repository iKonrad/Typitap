import Constants from '../constants/demoConstants';


const Actions = {
    setConfig() {
        return (dispatch) => {
            let configs = {
                credentials: 'include'
            };
            return fetch('/api/v1/conf', configs).then((r) => {
                return r.json();
            }).then((conf) => {
                dispatch({ type: Constants.SET_CONFIG, config: conf });
                console.log('Faked connection latency! Please, take a look ---> `server/api.go:22`');
            });
        }


    }
};

export default Actions;