const SET_USER_PROFILE_DATA = "SET_USER_PROFILE_DATA";
const FETCH_USER_PROFILE_DATA = "FETCH_USER_PROFILE_DATA";
const RESET_USER_PROFILE_DATA = "RESET_USER_PROFILE_DATA";
const FOLLOW_USER = "FOLLOW_USER";
const UNFOLLOW_USER = "UNFOLLOW_USER";
const ADD_COMMENT = "ADD_COMMENT";
const TURN_COMMENTS_PAGE = "TURN_COMMENTS_PAGE";

const initialState = {

    user: {
        Email: "test@test.com",
        Created: "0000-00-00 00:00:00",
    },
    fetching: false,
    follow: {
        followers: [],
        following: [],
    },
    comments: [],
    commentsPage: 1,

}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_PROFILE_DATA:
            return {

                ...state,
                fetching: true,
                commentsPage: 1,
            }
        case SET_USER_PROFILE_DATA:
            return {

                ...state,
                ...action.profile,
                fetching: false,
                commentsPage: 1,

            }
        case RESET_USER_PROFILE_DATA:
            return initialState;

        case FOLLOW_USER:
            return {

                ...state,
                follow: {
                    ...state.follow,
                    followers: [
                        ...state.follow.followers,
                        {
                            id: action.id,
                            username: action.username,
                            email: action.email,
                        }
                    ]
                }
            }

        case UNFOLLOW_USER:
            return {

                ...state,
                follow: {
                    ...state.follow,
                    followers: state.follow.followers.filter(obj => obj.id !== action.id),
                }

            }
        case ADD_COMMENT:
            return {
                ...state,
                comments: [
                    {
                        Id: "?????",
                        Text: action.text,
                        Created: new Date().toLocaleString(),
                        User: {
                            Email: action.email,
                            Username: action.username,
                        }
                    },
                    ...state.comments,
                ]
            }
        case TURN_COMMENTS_PAGE:
            return {
                ...state,
                commentsPage: action.page
            }
    }
    return state;
}


export function fetchUserProfile(username) {
    return (dispatch) => {
        return fetch("/api/user/profile/" + username, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                return dispatch({type: SET_USER_PROFILE_DATA, profile: response.data});
            }
        })

    }
}

export function resetUserProfile() {
    return {type: RESET_USER_PROFILE_DATA};
}

export function followUser(id, username, email) {
    return {type: FOLLOW_USER, id, username, email};
}

export function unfollowUser(id) {
    return {type: UNFOLLOW_USER, id};
}

export function addComment(username, email, text) {

    return { type: ADD_COMMENT, username, email, text }
}

export function turnCommentsPage(page) {
    return { type: TURN_COMMENTS_PAGE, page }
}