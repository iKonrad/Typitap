const LOGIN_USER_SUCCESS =  "LOGIN_USER_SUCCESS";
const LOGOUT_USER_SUCCESS =  "LOGOUT_USER_SUCCESS";
const ACTIVATE_USER_SUCCESS =  "ACTIVATE_USER_SUCCESS";
const ACTIVATE_USER_FAILURE =  "ACTIVATE_USER_FAILURE";
const SAVE_USER_DATA =  "SAVE_USER_DATA";



export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return {
                loggedIn: true,
                data:  {
                    ...action.user
                }
            };
        case LOGOUT_USER_SUCCESS:
            return {
                loggedIn: false,
                data: {},
            };
        case ACTIVATE_USER_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    Active: true,
                }
            }
    }

    return state;
}


export function checkToken(sessionToken) {

    return (dispatch) => {
        return fetch("/api/v1/auth/check", {
            method: "POST",
            credentials: "include"
        }).then((data) => {
            return r.json();
        }).then((data) => {
            dispatch({type: SAVE_USER_DATA, data});
        });
    }
};


export function loginUser(user) {
    return (dispatch) => {
        dispatch({type: LOGIN_USER_SUCCESS, user});
    }
};

export function logoutUser() {

    return (dispatch) => {

        return fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin"
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: LOGOUT_USER_SUCCESS});
            }
        });

    }

};


export function activateUser(token) {
    return (dispatch) => {
        return fetch("/api/auth/activate/" + token, {
            method: "POST",
            credentials: "same-origin"
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success) {
                dispatch ({type: ACTIVATE_USER_SUCCESS});
            }
            return response;
        });
    }
};