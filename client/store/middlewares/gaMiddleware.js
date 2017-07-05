import * as gaUtils from 'utils/gaUtils';

const gaMiddleware = (function () {
    return store => next => action => {

        if (typeof window === "undefined") {
            return next(action);
        }

        switch (action.type) {
            //The user wants us to connect
            case "@@router/LOCATION_CHANGE":
                if (action.payload !== undefined && action.payload !== null && store.getState().routing.locationBeforeTransitions !== null) {
                    if (action.payload.pathname !== store.getState().routing.locationBeforeTransitions.pathname) {
                        gaUtils.logPageView(action.payload.pathname);
                    }
                }

                return next(action);

            case "@@user/UPDATE_USER_FIELD":
                gaUtils.logEvent("Account", "Updated field", action.key);
                return next(action);

            case "@@redux-form/SET_SUBMIT_SUCCEEDED":
                gaUtils.logEvent("User", "Submitted form with success", action.meta.form);
                return next(action);

            case "@@redux-form/SET_SUBMIT_FAILED":
                gaUtils.logEvent("User", "Submitted form with errors", action.meta.form);
                return next(action);

            case "@@user/LOGOUT_USER_SUCCESS":
                gaUtils.logEvent("User", "Logged out", store.getState().user.data.Id);
                return next(action);

            case "@@game/JOINED_ROOM":
                gaUtils.logEvent("Game", `Joined ${ store.getState().game.online ? "online" : "offline" } room`, action.roomId);
                return next(action);

            case "@@game/FINISH_GAME":
                gaUtils.logEvent("Game", `Finished ${ store.getState().game.online ? "online" : "offline" } game`, store.getState().game.room.id);
                return next(action);

            case "@@game/START_WAIT_COUNTDOWN":
                gaUtils.logEvent("Game", `Start game countdown`, store.getState().game.room.id);
                return next(action);

            case "@@profile/FOLLOW_USER":
                gaUtils.logEvent("User", `Following user`, store.getState().user.data.Id);
                return next(action);

            case "@@profile/UNFOLLOW_USER":
                gaUtils.logEvent("User", `Unfollowing user`, store.getState().user.data.Id);
                return next(action);

                default:
                return next(action);
        }
    }
})();

export default gaMiddleware