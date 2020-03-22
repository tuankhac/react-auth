import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import withAuth from './withAuth';
import Home from './Home';
import Secret from './Secret';
import Login from './Login';

import MetisMenu from 'react-metismenu';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const content=[
  {
      icon: 'icon-class-name',
      label: 'Label of Item',
      to: '#a-link',
  },
  {
      icon: 'icon-class-name',
      label: 'Second Item',
      content: [
          {
              icon: 'icon-class-name',
              label: 'Sub Menu of Second Item',
              to: '#another-link',
          },
      ],
  },
];

class App extends Component {
  render() {
    return (
      
      <div>
        {/* <MetisMenu content={content} activeLinkFromLocation /> */}
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/secret">Secret</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/secret" component={withAuth(Secret)} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;
