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

    loginUser(user) {
        return (dispatch) => {
            dispatch({type: Constants.LOGIN_USER_SUCCESS, user});
        }
    },
    logoutUser() {

        return (dispatch) => {

            return fetch("/api/auth/logout", {
                method: "POST",
                credentials: "same-origin"
            }).then((response) => {
                return response.json();
            }).then((response) => {
                console.log("RES", JSON.stringify(response));
                if (response.success) {
                    return dispatch({type: Constants.LOGOUT_USER_SUCCESS});
                }
            });

        }

    },

    activateUser(token) {
        return (dispatch) => {
            return fetch("/api/auth/activate/" + token, {
                method: "POST",
                credentials: "same-origin"
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.success) {
                    return dispatch ({type: Constants.ACTIVATE_USER_SUCCESS});
                }
            });
        }
    }


};

export default Actions;