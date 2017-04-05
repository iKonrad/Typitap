import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'components/navigation/Navbar';

class Base extends Component {


    render() {

        return (
            <div id="main-container" className="main-container">
                <div id="wrap" className="container">
                    <Navbar />
                    <div id="react-container" className="main-content">
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStatsToProps = (state) => {
    return {
        demo: state.demo
    };
};

export default connect(mapStatsToProps)(Base);