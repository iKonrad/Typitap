const OPEN_EDIT_FIELD = "OPEN_EDIT_FIELD";
const CLOSE_EDIT_FIELD = "CLOSE_EDIT_FIELD";

const initialState = {
    details: {
        Name: {
            open: false
        },
        Email: {
            open: false
        },
        Password: {
            open: false
        },
        Bio: {
            open: false
        }
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case OPEN_EDIT_FIELD:

            let newObj = {};
            newObj[action.field] = {
                open: true,
            };

            return {
                ...state,
                details: {
                    ...state.details,
                    ...newObj
                }
            };
        case CLOSE_EDIT_FIELD:
            newObj = {};
            newObj[action.field] = {
                open: false,
            };
            return {
                ...state,
                details: {
                    ...state.details,
                    ...newObj
                }
            };
    }
    return state;
}


export function openEditField(field) {
    return {
        type: OPEN_EDIT_FIELD,
        field
    }
}

export function closeEditField(field) {
    return {
        type: CLOSE_EDIT_FIELD,
        field
    }
}

export function submitField(field, value) {

    return (dispatch) => {

        const formData = new FormData();
        formData.append("field", field);
        formData.append("value", value);

        return fetch("/api/user/account/update", {
            credentials: "same-origin",
            method: "POST",
            body: formData,
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json()
        });
    };

}