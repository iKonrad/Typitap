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
                    <select className="form-control" onChange={ this.onLanguageChange.bind(this) } defaultValue={ this.props.game.language }>
                        <option value="EN">English</option>
                        <option value="PL">Polish</option>
                    </select>
                </div>
            );
        }

        return (
            <div>
                <p>Current language: English <a href="#" onClick={ this.showLanguageSwitcher.bind(this) }>(change)</a></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        play: state.play,
        game: state.game,
    };
};

export default connect(mapStateToProps)(LanguageSwitcher);