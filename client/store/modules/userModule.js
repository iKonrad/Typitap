const LOGIN_USER_SUCCESS =  "LOGIN_USER_SUCCESS";
const LOGOUT_USER_SUCCESS =  "LOGOUT_USER_SUCCESS";
const ACTIVATE_USER_SUCCESS =  "ACTIVATE_USER_SUCCESS";
const ACTIVATE_USER_FAILURE =  "ACTIVATE_USER_FAILURE";
const SAVE_USER_DATA =  "SAVE_USER_DATA";
const UPDATE_USER_FIELD = "UPDATE_USER_FIELD";


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
        case UPDATE_USER_FIELD:
            let newObj = {};
            newObj[action.key] = action.value;

            return {
                ...state,
                data: {
                    ...state.data,
                    ...newObj
                }
            };
    }

    return state;
}


export function loginUser(user) {
    return (dispatch) => {
        dispatch({type: LOGIN_USER_SUCCESS, user});
    }
};

export function logoutUser() {

    return (dispatch) => {

        return fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin",
            headers: global.clientCookies
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: LOGOUT_USER_SUCCESS});
            }
        });

    }

};

export function updateUserField(key, value) {
    return {
        type: UPDATE_USER_FIELD,
        key,
        value,
    }
}