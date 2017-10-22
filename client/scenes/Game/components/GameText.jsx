import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as GameUtils from 'utils/gameUtils';

class GameText extends Component {

    renderText(text) {

        let words = text.split(" ");

        if (!this.props.game.finished && this.props.game.started) {
            words[this.props.game.currentIndex] = '<span class="word-highlighted">' + words[this.props.game.currentIndex] + '</span>';
        }

        // Highlight word in red if typo was made
        let newText = text;

        // Use this for cursor index when ready for deploy
        // let letters = newText.split("");
        // letters[this.props.game.currentIndex] = '<span class="word-index">'+ letters[this.props.game.currentIndex] + '</span>';
        // newText = letters.join("");

        if (Object.keys(this.props.game.mistakes).length > 0) {
            if (Object.keys(this.props.game.mistakes)[Object.keys(this.props.game.mistakes).length - 1] == this.props.game.currentIndex) {
                words[this.props.game.currentIndex] = '<span class="word-error">' + words[this.props.game.currentIndex] + '</span>';
                newText = words.join(' ');
            }
        }

        return newText;
    }

    render() {
        return (
            <div className="game__text">
                <p dangerouslySetInnerHTML={{__html: this.renderText(this.props.game.text)}}>
                </p>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

export default connect(mapStateToProps)(GameText);