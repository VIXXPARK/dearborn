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

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
    <Router>
      <Route path={ new RegExp("^(?!.*(/register|/login)).*$") } component={NavBar}/>
      <Route path={ new RegExp("^(?!.*(/register|/login)).*$") } component={FixedBar}/>
      <div style={{minHeight:'calc(100vh - 80px)'}}>
        <Switch>
          <Route exact path='/' component={Auth(LandingPageVote, null)}/>
          <Route exact path='/repo' component={Auth(LandingPageRepo, null)}/>
          <Route exact path='/login' component={Auth(LoginPage, false)}/>
          <Route exact path='/register' component={Auth(RegisterPage, false)}/>
          <Route exact path='/upload' component={Auth(UploadVotePage, true)}/>
        </Switch>
      </div>
      <Route path="^/(?!.*(/login|/register)).*$" component={Footer}/>
    </Router>
    </Suspense>
  );
}

export default App;
