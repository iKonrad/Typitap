import React, {Component} from 'react';
import {Link, Router} from 'react-router'
import {connect} from 'react-redux';
import NavLink from './NavLink';
import Icon from 'react-fontawesome';
import * as Constants from 'utils/constants';

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: Constants.MENU_TREE,
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
                            <img src="/static/images/identity/typitap-logo-white@1.25x.png" alt=""/>
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
                                (<NavLink to="/admin/users" key={'menu-item-admin'}>ACP</NavLink>) :
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