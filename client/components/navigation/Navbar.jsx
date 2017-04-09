import React, {Component} from 'react';
import {Link, Router} from 'react-router'
import {connect} from 'react-redux';
import NavLink from './NavLink';

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
                // {
                //     label: 'Dashboard',
                //     type: 'link',
                //     url: '/',
                //     authenticated: true
                // },
                {
                    label: 'My account',
                    type: 'dropdown',
                    url: '#',
                    authenticated: true,
                    items: [
                        {
                            label: 'Account',
                            type: 'link',
                            url: '/account',
                            authenticated: true
                        },
                        {
                            label: 'Log out',
                            type: 'link',
                            url: '/logout',
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

    render() {


        return (
            <nav className="navbar navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/"><img src="/static/images/identity/logo-white-sm.png"
                                                                   alt=""/></Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav pull-right">
                            { this.state.menu.map((obj, index) => {
                                if (obj.authenticated === this.props.user.loggedIn) {

                                    if (obj.type === 'link') {
                                        return <NavLink to={obj.url} key={'menu-item-' + index}>{ obj.label }</NavLink>;
                                    } else if (obj.type === 'button') {
                                        return <NavLink to={obj.url} key={'menu-item-' + index}
                                                        type="button">{ obj.label }</NavLink>;
                                    } else if (obj.type === 'dropdown') {
                                        return (
                                            <li className="dropdown" key={'dropdown-' + index}>
                                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{ obj.label } <span className="caret" style={{marginLeft: '5px'}}></span></a>
                                                <ul className="dropdown-menu">
                                                    { obj.items.map((item, index) => {
                                                        return <NavLink className='dropdown-item' to={item.url}  key={'menu-dropdown-item-' + index}>{ item.label }</NavLink>;
                                                    }) }
                                                </ul>
                                            </li>
                                        );
                                    }
                                }
                            })}
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