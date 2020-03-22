import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Logout from './Logout';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            status: 0,
            message: 'Loading...'
        }
    }
    componentDidMount() {
        try{
            axios.get('/api/secret').then(res => {
                console.log("/api/secret " + res);
                this.setState({ message: '', status: res.status, username: res.data })
            })
        }catch(error){
            console.log(error);
        }
    }
    logoutSubmit = (event) => {
        window.$('.loading').show();
        axios.get('/api/logout').then(res => {
            localStorage.clear();
            window.location.href = window.url_frontend + "login";
        })
        window.$('.loading').hide();
    }

    render() {
        if (this.state.status === 200) {
            console.log("this.state.token " + this.state.username)
            return (
                <header className="main-header">
                    {/* <!-- Logo --> */}
                    <a href="/" className="logo">
                        {/* <!-- mini logo for sidebar mini 50x50 pixels --> */}
                        <span className="logo-mini"><b>A</b>LT</span>
                        {/* <!-- logo for regular state and mobile devices --> */}
                        <span className="logo-lg"><b>Template</b>LTE</span>
                    </a>

                    {/* <!-- Header Navbar: style can be found in header.less --> */}
                    <nav className="navbar navbar-static-top">
                        {/* <!-- Sidebar toggle button--> */}
                        <a href="#" className={"sidebar-" + "toggle"} data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src="adminlte/dist/img/user2-160x160.jpg" className="user-image" alt="User Image" />
                                        <span className="hidden-xs">{this.state.username}&nbsp;</span>
                                        <span className="fa fa-caret-down" aria-hidden="true"></span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        {/* <!-- User image -->*/}
                                        <li className="user-header">
                                            <img src="adminlte/dist/img/user2-160x160.jpg" className="img-circle" alt="User Image" />
                                            <p>
                                            {this.state.username}
                                            </p>
                                        </li>
                                        
                                        {/*<!-- Menu Footer-->*/}
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="profile" className="btn btn-default btn-flat">Profile</a>
                                            </div>
                                            <div className="pull-right">
                                            <Route path='/logout' exact={false}>
                                                <Logout></Logout>
                                            </Route>
                                                <a href="logout" className="btn btn-default btn-flat">Sign out</a>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            )
        } else {
            return (
                <header className="main-header">
                    {/* <!-- Logo --> */}
                    <a href="/" className="logo">
                        {/* <!-- mini logo for sidebar mini 50x50 pixels --> */}
                        <span className="logo-mini"><b>A</b>LT</span>
                        {/* <!-- logo for regular state and mobile devices --> */}
                        <span className="logo-lg"><b>Template</b>LTE</span>
                    </a>

                    {/* <!-- Header Navbar: style can be found in header.less --> */}
                    <nav className="navbar navbar-static-top">
                        {/* <!-- Sidebar toggle button--> */}
                        <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        
                    </nav>
                </header>
            )
        }
    }
}

export default Header;
