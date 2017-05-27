import React from 'react';
import Animation from 'react-spinkit';

class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="spinner">
                <Animation name="pacman" color="#59c3c3" fadeIn="quarter" />
            </div>
        );
    }
}

export default Spinner;