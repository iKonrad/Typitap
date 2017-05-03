import React, { Component } from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';

export default class NavLink extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            active: context.router.isActive(props.to, true)
        }

    }

    render() {
        let className = this.state.active ? 'active' : '';

        if (this.props.type === 'button') {
            return (
                <li className={className}>
                    <div className="navbar-btn">
                        <Link {...this.props} className='btn btn-secondary btn-round'>
                            {this.props.children}
                        </Link>
                    </div>
                </li>
            );
        } else {
            return (
                <li className={className}>
                    <Link {...this.props}>
                        {this.props.children}
                    </Link>
                </li>
            );
        }
    }
}

NavLink.contextTypes = {
    router: PropTypes.object.isRequired
};


