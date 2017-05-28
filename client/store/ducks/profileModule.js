const SET_USER_PROFILE_DATA = "SET_USER_PROFILE_DATA";
const FETCH_USER_PROFILE_DATA = "FETCH_USER_PROFILE_DATA";
const RESET_USER_PROFILE_DATA = "RESET_USER_PROFILE_DATA";
const FOLLOW_USER = "FOLLOW_USER";
const UNFOLLOW_USER = "UNFOLLOW_USER";


const initialState = {

    user: {
        Email: "test@test.com",
        Created: "0000-00-00 00:00:00",
    },
    fetching: false,
    follow: {
        followers: [],
        following: [],
    }

}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_PROFILE_DATA:
            return {

                ...state,
                fetching: true,

            }
        case SET_USER_PROFILE_DATA:
            return {

                ...state,
                ...action.profile,
                fetching: false,

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