import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PlayActions from "#app/scenes/Play/ducks/playModule";
import * as GameActions from "store/ducks/gameModule";

class LanguageSwitcher extends React.Component {

    showLanguageSwitcher(e) {
        e.preventDefault();
        this.props.dispatch(PlayActions.showLanguageSwitcher());
    }

    onLanguageChange(e) {
        let language = e.target.value;
        if (language === "") {
            language = "EN";
        }
        this.props.dispatch(GameActions.changeGameLanguage(language));
    }

    render() {
        if (this.props.play.showLanguageSwitcher) {
            return (
                <div className="form-group">
                    <label>Language:</label>
                    <select className="form-control background-white" onChange={ this.onLanguageChange.bind(this) } value={ this.props.game.language }>
                        { this.props.app.languages.map((language, index) => {
                            return <option key={ `language-${index}` } value={ language.Id }>{ language.Name }</option>
                        }) }
                    </select>
                </div>
            );
        }
        return (
            <div>
                <p><button onClick={ this.showLanguageSwitcher.bind(this) } className="btn btn-link btn-sm">Change game settings</button></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app,
        play: state.play,
        game: state.game,
    };
};

export default connect(mapStateToProps)(LanguageSwitcher);