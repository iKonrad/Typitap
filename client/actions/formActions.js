import Constants from 'constants/userConstants';
import {SubmissionError} from 'redux-form';

const FormActions = {
    submitLogin(data) {
        const formData = new FormData();
        for (var i in data) {
            formData.append(i, data[i]);
        }

        return fetch("/api/auth/login", {
            method: "POST",
            body: formData,
            credentials: "same-origin",
        }).then((response) => {
            return response.json();
        }).then((response) => {
            // Check if login was successful
            if (response.errors) {
                throw new SubmissionError(response.errors);
            }

            if (response.error) {
                throw new SubmissionError({_error: response.error, username: response.error, password: ""});
            }

            // Logged in
            return {type: Constants.LOGIN_USER_SUCCESS, user: response.user};

        });
    },


    submitSignup(data) {

        const formData = new FormData();
        for (var i in data) {
            formData.append(i, data[i]);
        }

        return fetch("/api/auth/signup", {
            method: "POST",
            body: formData,
            credentials: "same-origin",
        }).then((response) => {
            return response.json();
        }).then((response) => {
            // Check if login was successful
            if (response.errors) {
                throw new SubmissionError(response.errors);
            }

            return (dispatch) => {
                dispatch({type: Constants.LOGIN_USER_SUCCESS, user: response.user});
            }
            // Signed up and logged in

        });
    }
};

export default FormActions;