import { Howl } from 'howler';

export const SOUNDS_PATH = "/static/sounds/";

export const SOUNDS = {
    GAME_COUNTDOWN_TICK: SOUNDS_PATH + "s_countdown_tick.ogg",
    GAME_FINISHED_FIRST_PLACE: SOUNDS_PATH + "s_first_place.ogg",
    GAME_FINISHED: SOUNDS_PATH + "s_game_completed.ogg",
    GAME_COUNTDOWN_START: SOUNDS_PATH + "s_game_countdown_start.ogg",
    GAME_START: SOUNDS_PATH + "s_game_start.ogg",
    GAME_PLAYER_JOINS: SOUNDS_PATH + "s_player_joins.ogg",
    GAME_PLAYER_LEAVES: SOUNDS_PATH + "s_player_leaves_2.ogg",
    GAME_MISTAKE: SOUNDS_PATH + "s_typo.ogg",
    GAME_WORD_FINISHED: SOUNDS_PATH + "s_word_finished.ogg",
};

const VOLUME = 0.3;

let soundMap = {};

Object.keys(SOUNDS).map((obj) => {
    soundMap[SOUNDS[obj]] =  new Howl({
        src: [SOUNDS[obj]],
        volume: VOLUME
    });
});

export function playSound(soundName) {
    soundMap[soundName].play();
}
