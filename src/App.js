import React, { Component } from 'react';
// import './components/styles/AdminLTE.min.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import withAuth from './withAuth';
import routes from './components/utils/routes';
import Login from './components/common/Login'

import Menu from './components/common/Menu';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// window.apiClient = require("axios");
// window.apiClient.defaults.headers.common["Authorization"] = localStorage.getItem("tokenChatbot");

window.url_frontend = 'http://localhost:3000/'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
  }

  onSelectProject = (event) => {
    var target = event.target;
    var value = {};

    if (target.name === 'currProject') {
      var project = this.state.projects.filter((p) => {
        return p.id === parseInt(target.value)
      });
      value = project[0];
      // localStorage.setItem('myProject', JSON.stringify(value));
    }
    this.setState({
      currProject: value
    });
  }

  render() {
    return (
      <Router>
        <Switch> 
          <Route path='/login' exact={true} component={Login} />
          <Route path="/">
          <Header />
          <aside className="main-sidebar"> 
            {/* <!-- sidebar: style can be found in sidebar.less --> */}
            <section className="sidebar" style={{ height: 'auto' }}>
              <Menu />
            </section>
          </aside>
          <div className="content-wrapper">
            <section className="content-header">
              <h1> Dashboard <small>Version 2.0</small>
              </h1>
              <ol className="breadcrumb">
                <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                <li className="active">Dashboard</li>
              </ol>
            </section>
            <section className="content">
              {this.showContentMenus(routes)}
            </section>
          </div>
          <Footer />
          <div className="control-sidebar-bg"></div>
          </Route>
        </Switch>
      </Router>

    );
  }

  showContentMenus = (routes) => {
    var rs = null;
    if (routes.length > 0) {
      rs = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withAuth(route.main)}
          ></Route>
        )
      })
    }
    return rs;
  }
}

export default App;