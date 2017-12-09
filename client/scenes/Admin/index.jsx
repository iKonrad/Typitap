import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Navbar from 'components/navigation/Navbar';
import * as MenuConstants from './utils/menu';

class AdminBase extends Component {

    render() {
        return (
            <div id="admin">
                <Navbar menu={MenuConstants.MENU_TREE} />
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="mt-4">
                                { this.props.children }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(AdminBase);