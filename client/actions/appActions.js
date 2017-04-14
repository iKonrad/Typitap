import Constants from '../constants/appConstants';


const Actions = {
    setResponse(response) {
        console.log("RESPPPP", JSON.stringify(response));
        return (dispatch) => {
            return dispatch({type: Constants.SET_RESPONSE, payload: response})
        }
    }
};

export default Actions;