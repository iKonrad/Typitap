import {SubmissionError} from 'redux-form';


export function submitLogin(data) {
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
        return {user: response.user};
    });
}

export function submitSignup(data) {

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

        return {user: response.user};
    });
}



export function submitForgot(data) {

    const formData = new FormData();
    for (var i in data) {
        formData.append(i, data[i]);
    }

    return fetch("/api/auth/password/forgot", {
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

        return {};
    });
}


export function validateToken(token) {

    return fetch("/api/auth/password/validate/" + token, {
        method: "POST",
        credentials: "same-origin",
    }).then((response) => {
        return response.json();
    }).then((response) => {
        return response.valid;
    });
}



export function submitPasswordReset(data) {
    const formData = new FormData();
    for (var i in data) {
        formData.append(i, data[i]);
    }

    return fetch("/api/auth/password/reset", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
    }).then((response) => {
        return response.json();
    }).then((response) => {
        if (response.errors) {
            throw new SubmissionError(response.errors);
        }

        if (response.error) {
            throw new SubmissionError({_error: response.error, username: response.error, password: ""});
        }

    });
}




