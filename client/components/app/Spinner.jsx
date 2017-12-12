import React from 'react';
import Icon from '@fortawesome/react-fontawesome';

class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="spinner">
                <Icon icon={['fas', 'cog']} spin />
            </div>
        );
    }
}

export default Spinner;