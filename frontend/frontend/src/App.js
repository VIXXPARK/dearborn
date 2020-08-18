import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css';

import Auth from './hoc/auth'

import NavBar from './components/views/NavBar/NavBar'
import FixedBar from './components/views/FixedBar/FixedBar'
import Footer from './components/views/Footer/Footer'
import LandingPageRepo from './components/views/LandingPage/LandingPageRepo'
import LandingPageVote from './components/views/LandingPage/LandingPageVote'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import VoteDetailPage from './components/views/DetailPage/VoteDetailPage'
import UploadVotePage from './components/views/UploadPage/UploadVotePage'
import CheckEmailPage from './components/views/LoginPage/CheckEmailPage'
import CheckEmailFailPage from './components/views/LoginPage/CheckEmailFailPage'
import BlogPage from './components/views/BlogPage/BlogPage'
import ChangePasswordPage from './components/views/LoginPage/ChangePasswordPage'
import ChangePasswordPage2 from './components/views/LoginPage/ChangePasswordPage2'
function App(props) {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
    
    <Router>
      <Route path={ new RegExp("^(?!.*(/register|/login|/checkEmail|/changePassword)).*$") } component={NavBar}/>
      <Route path={ new RegExp("^(?!.*(/register|/login|/checkEmail|/changePassword)).*$") } component={FixedBar}/>
      <div style={{minHeight:'calc(100vh - 80px)'}}>
        <Switch>
          <Route exact path='/' component={Auth(LandingPageVote, null)}/>
          <Route exact path='/repo' component={Auth(LandingPageRepo, null)}/>
          <Route exact path='/login' component={Auth(LoginPage, false)}/>
          <Route exact path='/register' component={Auth(RegisterPage, false)}/>
          <Route exact path='/upload' component={Auth(UploadVotePage, true)}/>
          <Route exact path='/checkEmail' component={Auth(CheckEmailPage, null)}/>
          <Route exact path='/checkEmail/failed' component={Auth(CheckEmailFailPage, null)}/>
          <Route exact path='/:designer' component={Auth(BlogPage, null)}/>
          <Route exact path='/changePassword/1' component={Auth(ChangePasswordPage, null)}/>
          <Route exact path='/changePassword/2/:uid/:token' component={Auth(ChangePasswordPage2, null)}/>
        </Switch>
      </div>
      <Route path="/" component={Auth(VoteDetailPage, null)}/>
      <Route path="^/(?!.*(/login|/register|/checkEmail|/changePassword)).*$" component={Footer}/>
    </Router>
    </Suspense>
  );
}

export default App;
