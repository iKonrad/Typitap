import React, {PureComponent} from 'react';
import {Link, Router} from 'react-router'
import {connect} from 'react-redux';
import NavLink from './NavLink';


class Navbar extends PureComponent {

    constructor(props) {
        super(props);
    }

    renderDropdown(index, obj) {
        return (
            <li className="nav-item dropdown" key={'dropdown-' + index}>
                <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false">
                    {obj.label}
                    <span className="caret" style={{marginLeft: '5px'}}></span>
                </a>
                <ul className="dropdown-menu">
                    {obj.items.map((item, index) => {
                        return <NavLink className='dropdown-item' to={item.url}
                                        key={'menu-dropdown-item-' + index}>{item.label}</NavLink>;
                    })}
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
            <nav className="navbar bg-faded navbar-expand-md">
                <Link className="navbar-brand" to="/">
                    <img src="/static/images/identity/typitap-logo-white.png" alt=""/>
                </Link>
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa fa-bars text-white"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ml-auto">
                        {this.props.menu.map((obj, index) => {
                            if (this.props.user && ((!obj.authenticated && this.props.user.loggedIn === undefined) || obj.authenticated === this.props.user.loggedIn || obj.authenticated === undefined)) {
                                let parsedObj = obj;
                                parsedObj.label = that.parseValue(obj.label);
                                if (obj.type === 'link' || obj.type === 'button') {
                                    return <NavLink to={obj.url} key={'menu-item-' + index} className='nav-link' type={parsedObj.type}>{parsedObj.label}</NavLink>;
                                } else if (parsedObj.type === 'dropdown') {
                                    return that.renderDropdown(index, parsedObj);
                                } else if (parsedObj.type === 'href') {
                                    return (
                                        <li key={`menu-item-${index}`} className='nav-item'>
                                            <a href={parsedObj.url} className='nav-link'>
                                                {parsedObj.label}
                                            </a>
                                        </li>
                                    )
                                } else if (parsedObj.type === "logout") {
                                    return (<a href="/auth/logout" key={'menu-item' + index}>Log out</a>);
                                }
                            }
                        })}

                        {(this.props.user.data !== undefined && ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"].indexOf(this.props.user.data.Role) > -1) ?
                            (<NavLink to="/admin/users" key={'menu-item-admin'}
                                      onClick={this.handleClick}>ACP</NavLink>) :
                            ("")
                        }
                    </ul>
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