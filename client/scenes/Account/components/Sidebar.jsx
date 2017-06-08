import React from 'react';
import { Link } from 'react-router';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="account__sidebar">
                <h4>Account</h4>
                <ul className="sidebar-links">
                    <li><Link to="/account/details" activeClassName="active">Your details</Link></li>
                    <li><Link to="/account/avatar" activeClassName="active">Avatar</Link></li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;