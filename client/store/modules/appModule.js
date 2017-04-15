const SET_RESPONSE = "SET_RESPONSE";

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_RESPONSE:
            return {
                ...state,
                response: action.payload
            }
    }

    return state;
}


export function setResponse(response) {
    if (!response || response === undefined || response === null) {
        response = {};
    }
    return {type: SET_RESPONSE, payload: response};
}