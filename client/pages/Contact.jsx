import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Actions from 'actions/demoActions';

class Contact extends Component {

    static onEnter({store, nextState, replaceState, callback}) {
        callback();
    }


    render() {
        return (
            <div className="">
                <div className="lol"><h1>Twoj stary</h1></div>
                <p>
                    Please take a look at <Link to='/docs'>usage</Link> page. or <Link to="/contact">contact us</Link>
                </p>
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        demo: state.demo
    }
};

export default connect(mapStateToProps)(Contact);