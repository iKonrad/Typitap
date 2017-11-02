import {SubmissionError} from "redux-form";

const LOAD_DATA_VALUES = '@@submitTextForm/LOAD_DATA_VALUES';
const RESET_DATA_VALUES = '@@submitTextForm/RESET_DATA_VALUES';

const initialState = {
    data: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATA_VALUES:
            return {
                data: action.data
            }
        case RESET_DATA_VALUES:
            return initialState;
        default:
            return state
    }
}

/**
 * Simulates data loaded into this reducer from somewhere
 */
export const loadDataValues = data => ({ type: LOAD_DATA_VALUES, data });

export function submitForm(data) {
    const formData = new FormData();

    for (var i in data) {
        formData.append(i, data[i]);
    }

    let url = "/api/user/texts";

    if (data["Id"] !== undefined) {
        url = url + "/" + data["Id"];
    }

    return fetch(url, {
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
            throw new SubmissionError({_error: response.error, text: response.error});
        }

        return {data: response.data};
    });
}

export const resetDataValues = data => ({type: RESET_DATA_VALUES});

export default reducer