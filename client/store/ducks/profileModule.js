const SET_USER_PROFILE_DATA = "@@profile/SET_USER_PROFILE_DATA";
const FETCH_USER_PROFILE_DATA = "@@profile/FETCH_USER_PROFILE_DATA";
const RESET_USER_PROFILE_DATA = "@@profile/RESET_USER_PROFILE_DATA";
const FOLLOW_USER = "@@profile/FOLLOW_USER";
const UNFOLLOW_USER = "@@profile/UNFOLLOW_USER";
const ADD_COMMENT = "@@profile/ADD_COMMENT";
const TURN_COMMENTS_PAGE = "@@profile/TURN_COMMENTS_PAGE";


const initialState = {
    user: {
        Email: "",
        Created: "",
    },
    fetching: false,
    follow: {
        followers: [],
        following: [],
    },
    charts: {},
    comments: [],
    commentsPage: 1,
};

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
            };

        case UNFOLLOW_USER:
            return {
                ...state,
                follow: {
                    ...state.follow,
                    followers: state.follow.followers.filter(obj => obj.id !== action.id),
                }
            };

        case ADD_COMMENT:

            let comments = [
                ...state.comments
            ];

            comments.unshift({
                Id: "",
                Text: action.text,
                Created: new Date().toLocaleString(),
                User: {
                    Email: action.email,
                    Username: action.username,
                }
            });

            return {
                ...state,
                comments,
            };

        case TURN_COMMENTS_PAGE:
            return {
                ...state,
                commentsPage: action.page
            }
    }
    return state;
}

/**
 * Fetches the profile data
 *
 * @param username
 * @returns {function(*)}
 */
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

/**
 * Resets profile to default values
 *
 * @returns {{type: string}}
 */
export function resetUserProfile() {
    return {type: RESET_USER_PROFILE_DATA};
}


/**
 * Adds a user to the following list
 *
 * @param id
 * @param username
 * @param email
 * @returns {{type: string, id: *, username: *, email: *}}
 */
export function followUser(id, username, email) {
    return {type: FOLLOW_USER, id, username, email};
}


/**
 * Removes a user from the following list
 *
 * @param id
 * @returns {{type: string, id: *}}
 */
export function unfollowUser(id) {
    return {type: UNFOLLOW_USER, id};
}


/**
 * Adds a comment to the profile
 *
 * @param username
 * @param email
 * @param text
 * @returns {{type: string, username: *, email: *, text: *}}
 */
export function addComment(username, email, text) {
    return {type: ADD_COMMENT, username, email, text}
}


/**
 * Sets the comments page index
 *
 * @param page
 * @returns {{type: string, page: *}}
 */
export function turnCommentsPage(page) {
    return {type: TURN_COMMENTS_PAGE, page}
}