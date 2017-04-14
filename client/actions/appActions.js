import Constants from '../constants/appConstants';


const Actions = {
    setResponse(response) {
        if (!response || response === undefined || response === null) {
            response = {};
        }

        return {type: Constants.SET_RESPONSE, payload: response};

    }
};

export default Actions;