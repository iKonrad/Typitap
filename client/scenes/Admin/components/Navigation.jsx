import React, {Component} from 'react';
import {Link} from 'react-router';

class Navigation extends Component {

    render() {
        return (
            <div>
                <ul className="horizontal_navigation">
                    <li>
                        <Link to="/admin/users" activeClassName="active">Users</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Navigation;