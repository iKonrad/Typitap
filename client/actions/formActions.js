import Constants from 'constants/userConstants';
import {SubmissionError} from 'redux-form';

const FormActions = {
    submitLogin(data) {

        return (dispatch) => {
            return fetch("", {
                method: "POST",
                credentials: "same-origin"
            }).then((response) => {
                return r.json();
            }).then((response) => {
                // Check if login was successful
            });
        }
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
                console.log(response);
                return response.json();
            }).then((response) => {
                // Check if login was successful
                console.log(response);
                throw new SubmissionError(response.errors);
            });
    }
};

export default FormActions;