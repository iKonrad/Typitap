import React from 'react';

class TextStats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.text === undefined || this.props.text === "") {
            return <p>Type in (or paste) your test to see stats.</p>;
        }

        let characters = this.props.text.length;
        let words = this.props.text.split(" ");
        let longestWord = "";
        words.forEach((obj) => {
            if (obj.length > longestWord.length) {
                longestWord = obj;
            }
        });

        let specialChars = {};
        let specialCharsTotal = 0;
        this.props.text.split("").forEach((letter) => {
            if (!letter.match(/[a-zA-Z0-9 ]/)) {
                specialChars[letter] = specialChars[letter] === undefined ? 1 : specialChars[letter] + 1;
                specialCharsTotal++;
            }
        });

        let averageWordLength = characters / words.length;

        return (
            <div>
                <p key="1">
                    <strong>Characters: </strong>
                    <span className={(characters.length < 160 || characters.length > 240) ? "text-danger" : ""}>
                        {characters}
                    </span>
                </p>
                <p key="2"><strong>Words: </strong> {words.length}</p>
                <p key="3"><strong>Average word length: </strong> {averageWordLength.toFixed(1)} characters</p>
                <p key="4"><strong>Longest word: </strong> <em>{longestWord}</em> ({longestWord.length} characters)</p>
                <p key="5"><strong>Special characters (total): </strong>{specialCharsTotal}</p>
                <p key="6"><strong>Special characters: </strong> {Object.keys(specialChars).map((obj) => {
                    return <span style={{
                        background: "#EFEFEF",
                        padding: "5px",
                        margin: "2px"
                    }}>{specialChars[obj]}<strong> {obj}</strong></span>
                })}</p>
            </div>
        )
    }
}

export default TextStats;