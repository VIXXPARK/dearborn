import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css';

import Auth from './hoc/auth'

import NavBar from './components/views/NavBar/NavBar'
import Footer from './components/views/Footer/Footer'
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import VoteListPage from './components/views/ListPage/VoteListPage'
import VoteDetailPage from './components/views/DetailPage/VoteDetailPage'
import RepoListPage from './components/views/ListPage/RepoListPage'
import RepoDetailPage from './components/views/DetailPage/RepoDetailPage'
import RepoModifyPage from './components/views/UploadPage/RepoModifyPage'
import UploadVotePage from './components/views/UploadPage/UploadVotePage'
import CheckEmailPage from './components/views/LoginPage/CheckEmailPage'
import CheckEmailFailPage from './components/views/LoginPage/CheckEmailFailPage'
import BlogPage_Prod_About from './components/views/BlogPage/BlogPage_Prod_About'
import BlogPage_Prod_Likes from './components/views/BlogPage/BlogPage_Prod_Likes'
import BlogPage_Prod_Works from './components/views/BlogPage/BlogPage_Prod_Works'
import BlogPage_Prod_Bid from './components/views/BlogPage/BlogPage_Prod_Bid'
import BlogPage_Cons_Bid from './components/views/BlogPage/BlogPage_Cons_Bid'
import BlogPage_Cons_Likes from './components/views/BlogPage/BlogPage_Cons_Likes'
import BlogPage_Cons_Event from './components/views/BlogPage/BlogPage_Cons_Event'
import ChangePasswordPage from './components/views/LoginPage/ChangePasswordPage'
import ChangePasswordPage2 from './components/views/LoginPage/ChangePasswordPage2'
import UserInfoMainPage from './components/views/UserInfoPage/UserInfoMainPage'
import UserUpdatePage from './components/views/UserInfoPage/UserUpdatePage'
import ContestListPage from './components/views/ListPage/ContestListPage'
import ContestDetailPage from './components/views/DetailPage/ContestDetailPage'
import ContestManagePage from './components/views/DetailPage/ContestManagePage'
import MessagePage from './components/views/MessagePage/MessagePage'

function App(props) {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
    
    <Router>
      <Route path={ new RegExp("^(?!.*(/register|/login|/checkEmail|/changePassword|/modify)).*$") } component={NavBar}/>
      <div style={{minHeight:'calc(100vh - 66px)'}}>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, null)}/>
          <Route exact path='/login' component={Auth(LoginPage, false)}/>
          <Route exact path='/register' component={Auth(RegisterPage, false)}/>
          <Route exact path='/upload' component={Auth(UploadVotePage, true)}/>
          <Route exact path='/checkEmail' component={Auth(CheckEmailPage, null)}/>
          <Route exact path='/checkEmail/failed' component={Auth(CheckEmailFailPage, null)}/>
          <Route exact path='/modify' component={Auth(UserInfoMainPage, true)}/>
          <Route exact path='/modify/settings' component={Auth(UserUpdatePage, true)}/>
          <Route exact path='/vote' component={Auth(VoteListPage, null)}/>
          <Route exact path='/repo' component={Auth(RepoListPage, null)}/>
          <Route exact path='/contest' component={Auth(ContestListPage, null)}/>
          <Route exact path='/contest/manage' component={Auth(ContestManagePage, null)}/>
          <Route exact path='/contest/:contestId' component={Auth(ContestDetailPage, true)}/>
          <Route exact path='/message' component={Auth(MessagePage, true)}/>
          <Route exact path='/:designer' component={Auth(BlogPage_Prod_About, null)}/>
          <Route exact path='/:designer/works' component={Auth(BlogPage_Prod_Works, null)}/>
          <Route exact path='/:designer/likes' component={Auth(BlogPage_Prod_Likes, null)}/>
          <Route exact path='/:designer/bid' component={Auth(BlogPage_Prod_Bid, null)}/>
          <Route exact path='/:designer/cons' component={Auth(BlogPage_Cons_Bid, null)}/>
          <Route exact path='/:designer/cons/likes' component={Auth(BlogPage_Cons_Likes, null)}/>
          <Route exact path='/:designer/cons/event' component={Auth(BlogPage_Cons_Event, null)}/>
          <Route exact path='/:designer/:postId' component={Auth(RepoDetailPage, true)}/>
          <Route exact path='/:designer/:postId/modify' component={Auth(RepoModifyPage, true)}/>
          <Route exact path='/changePassword/1' component={Auth(ChangePasswordPage, null)}/>
          <Route exact path='/changePassword/2/:uid/:token' component={Auth(ChangePasswordPage2, null)}/>
        </Switch>
      </div>
      <Route path="/" component={Auth(VoteDetailPage, null)}/>
      <Route path="^/(?!.*(/login|/register|/checkEmail|/changePassword|/modify)).*$" component={Footer}/>
    </Router>
    </Suspense>
  );
}

export default App;
