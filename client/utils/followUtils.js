import {getStore} from 'store/store';
import * as AppActions from 'store/modules/appModule';

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

    if (!state.user.loggedIn || state.user.follow.following.length === 0) {
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

export function followProfile() {
    let state = getStore().getState();
    getStore().dispatch(AppActions.followUser(state.user.data.Id, state.user.data.Username, state.user.data.Email));
}

export function unfollowProfile() {
    let state = getStore().getState();
    getStore().dispatch(AppActions.unfollowUser(state.user.data.Id));
}