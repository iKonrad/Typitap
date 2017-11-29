import React, { PureComponent } from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';

export default class NavLink extends PureComponent {

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
                <li className={`nav-item ` + className}>
                    <div className="navbar-btn">
                        <Link {...this.props} type={``} className='btn btn-primary' role="button">
                            {this.props.children}
                        </Link>
                    </div>
                </li>
            );
        } else {
            return (
                <li className={`nav-item ` + className}>
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


