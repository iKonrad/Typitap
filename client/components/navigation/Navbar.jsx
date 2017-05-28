import React, {Component} from 'react';
import {Link, Router} from 'react-router'
import {connect} from 'react-redux';
import NavLink from './NavLink';
import Icon from 'react-fontawesome';

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: [
                {
                    label: 'Log in',
                    type: 'link',
                    url: '/login',
                    authenticated: false
                },
                {
                    label: 'Sign up',
                    type: 'link',
                    url: '/signup',
                    authenticated: false
                },
                {
                    label: '%%Name%%',
                    type: 'dropdown',
                    url: '#',
                    authenticated: true,
                    items: [
                        {
                            label: 'Account',
                            type: 'link',
                            url: '/account/details',
                            authenticated: true
                        },
                        {
                            label: 'Log out',
                            type: 'logout',
                            url: '/auth/logout',
                            authenticated: true
                        },
                    ]
                },
                {
                    label: 'Play',
                    type: 'button',
                    url: '/play',
                    authenticated: false
                },
                {
                    label: 'Play',
                    type: 'button',
                    url: '/play',
                    authenticated: true
                },
            ]
        };
    }

    renderDropdown(index, obj) {
        return (
            <li className="dropdown" key={'dropdown-' + index}>
                <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false">
                    { obj.label }
                    <span className="caret" style={{marginLeft: '5px'}}></span>
                </a>
                <ul className="dropdown-menu">
                    { obj.items.map((item, index) => {
                        return <NavLink className='dropdown-item' to={item.url}
                                        key={'menu-dropdown-item-' + index}>{ item.label }</NavLink>;
                    }) }
                </ul>
            </li>
        );
    }


    parseValue(value) {
        if (this.props.user.loggedIn) {
            value = value.replace("%%Name%%", this.props.user.data.Name);
            value = value.replace("%%Email%%", this.props.user.data.Email);
        }
        return value;
    }

    render() {
        let that = this;

        return (
            <nav className="navbar">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#menu-collapse" aria-expanded="false">
                            <Icon name="bars" />
                        </button>
                        <Link className="navbar-brand" to="/">
                            <img src="/images/identity/typitap-logo-white@1.25x.png" alt=""/>
                        </Link>
                    </div>
                    <div className="collapse navbar-collapse" id="menu-collapse">
                        <ul className="nav navbar-nav navbar-right">
                            { this.state.menu.map((obj, index) => {
                                if (this.props.user && ((!obj.authenticated && this.props.user.loggedIn === undefined) || obj.authenticated === this.props.user.loggedIn)) {
                                    let parsedObj = obj;
                                    parsedObj.label = that.parseValue(obj.label);
                                    if (obj.type === 'link') {
                                        return <NavLink to={obj.url} key={'menu-item-' + index}>{ parsedObj.label }</NavLink>;
                                    } else if (parsedObj.type === 'button') {
                                        return <NavLink to={parsedObj.url} key={'menu-item-' + index} type="button">{ parsedObj.label }</NavLink>;
                                    } else if (parsedObj.type === 'dropdown') {
                                        return that.renderDropdown(index, parsedObj);
                                    } else if (parsedObj.type === "logout") {
                                        return (<a href="/auth/logout" key={ 'menu-item' + index }>Log out</a>);
                                    }
                                }
                            })}

                            { (this.props.user.data !== undefined && ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"].indexOf(this.props.user.data.Role) > -1 ) ?
                                (<NavLink to="/admin" key={'menu-item-admin'}>ACP</NavLink>) :
                                ("")
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

}


let mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

// export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(Sidebar);
export default connect(mapStateToProps, null, null, {pure: false})(Navbar);