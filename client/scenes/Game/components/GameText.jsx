import React, { Component } from 'react';
import { connect } from 'react-redux';


class GameText extends Component {

    renderText(text) {

        let words = text.split(" ");

        if (!this.props.game.finished && this.props.game.started) {
            words[this.props.game.currentIndex] = '<span class="word-highlighted">' + words[this.props.game.currentIndex] + '</span>';
        }

        for (let index in this.props.game.mistakes) {
            let value = this.props.game.mistakes[index];
            value = value <= 2 ? 1 : value < 5 ? 2 : 3;
            words[parseInt(index)] = '<span class="word-error">'+ words[parseInt(index)] +'</span>';
        }

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