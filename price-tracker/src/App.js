import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Homepage from './components/homepage/HomeParent';
import AuthParent from './components/auth/AuthParent';
import PtNavbar from './components/navbar/PtNavbar';
import PtListPage from './components/ptlists/PtListPage';
import Profile from './components/profile/Profile';
import TrendPage from './components/statspage/TrendPage';
import NotFound from './components/notfound/NotFound';
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
        <PtNavbar/>
        
        <Switch>
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/(register|login)' component={AuthParent}/>
          {this.isLoggedIn() ?
          <Route exact path='/price-lists' component={PtListPage} />:
          <Redirect to='/login' component={AuthParent}/>
          }
          {this.isLoggedIn() ?
          <Route exact path='/profile' component={Profile} />:
          <Redirect to='/login' component={AuthParent}/>
          }
          {this.isLoggedIn() ?
          <Route exact path='/analytics' component={TrendPage} /> :
          <Redirect to='/login' component={AuthParent} />
                }
          <Route exact path="" component={NotFound}/>
        </Switch>
      </Router>
    )
  }
}