import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as GameActions from 'store/modules/gameModule';

const FIELD_REF = "game__input-field";

class GameInput extends Component {


    componentDidMount() {
        this.refs[FIELD_REF].focus();
    }

    handleKey(key) {

        if (this.props.game.complete) {
            return;
        }

        let field = this.refs[FIELD_REF];
        let inputValue = field.value.replace(/ /g, '');

        let spaceBarPressed = field.value[field.value.length - 1] === ' ';
        let enterPressed = key !== undefined && key === 13;
        let backSpacePressed = inputValue.length < this.props.game.inputValue.length;

        let textWords = this.props.game.text.split(" ");
        let currentWord = textWords[this.props.game.currentIndex];

        // Check if enter or spacebar has been pressed
        if (spaceBarPressed || enterPressed) {
            // If value from the input field equals to the whole word, either submit the word or finish the game
            if (inputValue === currentWord) {
                if (this.props.game.currentIndex === (textWords.length - 1)) {
                    // Finish the game


                    // Run the callback if exists
                    if (this.props.onGameFinish && typeof this.props.onGameFinish === 'function') {
                        this.props.onGameFinish();
                    } else {
                        this.props.dispatch(GameActions.finishGame());
                    }

                    return;
                } else {
                    this.props.dispatch(GameActions.finishWord());
                    return;
                }
            }
        }

        // Handle error input
        inputValue = field.value;

        this.props.dispatch(GameActions.updateInput(inputValue));


        // Iterate through all the letters and check for errors
        if (!backSpacePressed) {
            if (this.hasInputErrors(inputValue, currentWord)) {
                this.props.dispatch(GameActions.makeMistake());
            }
        }

    }

    hasInputErrors(input, word) {

        for (let i = 0; i < input.length; i++) {
            if (input[i] !== word[i]) {
                return true;
            }
        }

        return false;
    }


    handleKeyInput(event) {
        let forwardKey = false;
        switch (event.keyCode) {
            case 8:
                // Backspace
                break;
            case 13:
                // Enter
                this.handleKey(13);
                break;
            case 32:
                // Space
                break;
        }

    }


    renderClasses() {

        let classes = "game__input";

        let textWords = this.props.game.text.split(" ");
        let currentWord = textWords[this.props.game.currentIndex];

        // Check if there are any errors for the current wor
        if (this.hasInputErrors(this.props.game.inputValue, currentWord)) {
            classes = classes + " game__input--error";
        }

        return classes;

    }


    render() {

        return (
            <div className={ this.renderClasses() }>
                <input ref={ FIELD_REF } value={ this.props.game.inputValue } type="text" className="form-control"
                       placeholder="Type your text here" onKeyUp={ this.handleKeyInput.bind(this) }
                       onChange={ this.handleKey.bind(this) }/>
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

export default connect(mapStateToProps)(GameInput);