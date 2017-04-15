/**
 * GameWindow contains and manages the game state and all its components
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

class PlayerList extends Component {

    render() {
        return (
            <div className="">players</div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        app: state.app,
        game: state.game,
    }
};

export default connect(mapStateToProps)(PlayerList);