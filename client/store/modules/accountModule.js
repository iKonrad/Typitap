const OPEN_EDIT_FIELD = "OPEN_EDIT_FIELD";
const CLOSE_EDIT_FIELD = "CLOSE_EDIT_FIELD";

const initialState = {
    details: {
        name: {
            open: false
        },
        email: {
            open: false
        },
        password: {
            open: false
        },
        bio: {
            open: false
        }
    }
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case OPEN_EDIT_FIELD:
            let newState = {
                ...state
            };
            newState.details[action.field] = {
                ...state.details[action.field],
                open: true
            };
            return newState;
        case CLOSE_EDIT_FIELD:
            newState = {
                ...state
            };
            newState.details[action.field] = {
                ...state.details[action.field],
                open: false
            };
            return newState;
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