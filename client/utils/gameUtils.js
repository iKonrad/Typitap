export function renderText(mistakes, textWords) {

    for (let index in mistakes) {
        let value = mistakes[index];
        value = value <= 2 ? 1 : value < 5 ? 2 : 3;
        textWords[parseInt(index)] = '<span class="word-error">' + textWords[parseInt(index)] + '</span>';
    }

    return textWords;
}


export function formatTime(time) {
    let minutes = parseInt(time / 60);
    minutes = minutes > 9 ? minutes : '0' + minutes;
    let seconds = time % 60;
    seconds = seconds > 9 ? seconds : '0' + seconds;

    return minutes + ':' + seconds;
}