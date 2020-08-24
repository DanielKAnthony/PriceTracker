import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Homepage from './components/homepage/HomeParent';
import AuthParent from './components/auth/AuthParent';
import AmzNavbar from './components/navbar/AmzNavbar';
import AmazonListPage from './components/amazonlists/AmazonListPage';
import Cookies from 'js-cookie';

export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {};
  }

  isLoggedIn = () => {
    return Cookies.get("username") !== undefined &&
        Cookies.get("email") !== undefined;
  }

  render() {
    return(
      <Router forceRefresh={true}>
        <AmzNavbar/>
        <Switch>
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/(register|login)' component={AuthParent}/>
          {/* {this.isLoggedIn() ?
          <Route exact path='/amazon-lists' component={AmazonListPage} />:
          <Redirect to='/login' component={AuthParent}/>
          } */}
          <Route exact path='/amazon-lists' component={AmazonListPage} />

        </Switch>


      </Router>

    )
  }
}