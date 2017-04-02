import Constants from 'constants/userConstants';


const Actions = {
    checkToken(sessionToken) {

        return (dispatch) => {
            return fetch("/api/v1/auth/check", {
                method: "POST",
                credentials: "include"
            }).then((data) => {
                return r.json();
            }).then((data) => {
                dispatch({type: Constants.SAVE_USER_DATA, data});
            });
        }
    },
    logOut() {
        return {type: Constants.LOGOUT_USER_SUCCESS}
    }
};

export default Actions;