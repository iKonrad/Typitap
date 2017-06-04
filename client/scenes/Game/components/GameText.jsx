import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as GameUtils from 'utils/gameUtils';

class GameText extends Component {

    renderText(text) {

        let words = text.split(" ");

        if (!this.props.game.finished && this.props.game.started) {
            words[this.props.game.currentIndex] = '<span class="word-highlighted">' + words[this.props.game.currentIndex] + '</span>';
        }

        words = GameUtils.renderText(this.props.game.mistakes, words);

        return words.join(' ');
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