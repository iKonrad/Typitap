import * as gameActions from "store/ducks/gameModule";
import * as soundUtils from 'utils/soundUtils';
const soundMiddleware = (function () {
    return store => next => action => {

        switch (action.type) {
            //The user wants us to connect
            case gameActions.PLAYER_JOINED_ROOM:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_PLAYER_JOINS);
                next(action);
                break;
            case gameActions.PLAYER_LEFT_ROOM:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_PLAYER_LEAVES);
                next(action);
                break;
            case gameActions.FINISH_WORD:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_WORD_FINISHED);
                next(action);
                break;
            case gameActions.START_COUNTDOWN:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_COUNTDOWN_START);
                next(action);
                break;
            case gameActions.TICK_COUNTDOWN:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_COUNTDOWN_TICK);
                next(action);
                break;
            case gameActions.FINISH_GAME:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_FINISHED);
                next(action);
                break;
            case gameActions.START_GAME:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_START);
                next(action);
                break;
            case gameActions.MAKE_WORD_MISTAKE:
                soundUtils.playSound(soundUtils.SOUNDS.GAME_MISTAKE);
                next(action);
                break;
            default:
                return next(action);
        }
    }

})();

export default soundMiddleware