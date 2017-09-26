import * as ProfileActions from 'store/ducks/profileModule';
import * as UserActions from 'store/ducks/userModule';
import {getStore} from "#app/store/store";

export function toggleFollow(userId, follow = true) {

    let endpoint = follow ? "follow" : "unfollow";

    return fetch(`/api/user/${endpoint}/${userId}`, {
        credentials: "same-origin",
        method: "POST",
        headers: {
            "Cookie": global.clientCookies
        }
    }).then((response) => {
        return response.json();
    }).then((response) => {
        return response;
    });

}


export function isUserFollowing(userId) {
    let state = getStore().getState();

    if (!state.user.loggedIn || state.user.follow === undefined || state.user.follow.following.length === 0) {
        return false;
    }

    let following = false;
    state.user.follow.following.forEach((object) => {
             if (object.id === userId) {
                 following = true;
                 return;
             }
    });

    return following;
}

export function followUser() {
    let state = getStore().getState();
    getStore().dispatch(ProfileActions.followUser(state.user.data.Id, state.user.data.Username, state.user.data.Email));
    getStore().dispatch(UserActions.followUser(state.profile.user.Id, state.profile.user.Username, state.profile.user.Email));
}

export function unfollowUser() {
    let state = getStore().getState();
    getStore().dispatch(ProfileActions.unfollowUser(state.user.data.Id));
    getStore().dispatch(UserActions.unfollowUser(state.profile.user.Id));
}