import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Homepage from './components/homepage/HomeParent';
import AuthParent from './components/auth/AuthParent';
import Cookies from 'js-cookie';

export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {};
  }

  render() {
    return(
      <Router forceRefresh={true}>
        {/* nav here */}
        <Switch>
          <Route exact path='/' component={Homepage}/>

          <Route exact path='/(register|login)' component={AuthParent}/>

        </Switch>


      </Router>

    )
  }
}
