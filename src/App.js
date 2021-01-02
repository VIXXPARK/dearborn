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
import VoteDetailPage from './components/views/DetailPage/VoteDetailPage'
import UploadVotePage from './components/views/UploadPage/UploadVotePage'
import UploadModifyPage from './components/views/UploadPage/UploadModifyPage'
import CheckEmailPage from './components/views/LoginPage/CheckEmailPage'
import CheckEmailFailPage from './components/views/LoginPage/CheckEmailFailPage'
import BlogPage_Prod_About from './components/views/BlogPage/BlogPage_Prod_About'
import BlogPage_Prod_Likes from './components/views/BlogPage/BlogPage_Prod_Likes'
import BlogPage_Prod_Works from './components/views/BlogPage/BlogPage_Prod_Works'
import BlogPage_Cons_Likes from './components/views/BlogPage/BlogPage_Cons_Likes'
import BlogPage_Cons_Event from './components/views/BlogPage/BlogPage_Cons_Event'
import ChangePasswordPage from './components/views/LoginPage/ChangePasswordPage'
import ChangePasswordPage2 from './components/views/LoginPage/ChangePasswordPage2'
import UserInfoMainPage from './components/views/UserInfoPage/UserInfoMainPage'
import UserUpdatePage from './components/views/UserInfoPage/UserUpdatePage'
import ContestListPage from './components/views/ListPage/ContestListPage'
import ContestDetailPage from './components/views/DetailPage/ContestDetailPage'
import FindFeaturePage from './components/views/FindFeaturePage/FindFeaturePage'
import UserChangePasswordPage from './components/views/UserInfoPage/UserChangePasswordPage'
import RankPage from './components/views/RankPage/RankPage'
function App(props) {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
    
    <Router>
      
      <Route path={ new RegExp("^(?!.*(/register|/login|/checkEmail|/changePassword|/modify)).*$") } component={NavBar}/>
      <div >
        <div>
          <div style={{height:'100px'}}></div>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, null)}/>
          <Route exact path='/login' component={Auth(LoginPage, false)}/>
          <Route exact path='/register' component={Auth(RegisterPage, false)}/>
          <Route exact path='/upload' component={Auth(UploadVotePage, true)}/>
          <Route exact path='/upload/modify/:postId' component={Auth(UploadModifyPage, true)}/>
          <Route exact path='/checkEmail' component={Auth(CheckEmailPage, null)}/>
          <Route exact path='/checkEmail/failed' component={Auth(CheckEmailFailPage, null)}/>
          <Route exact path='/modify' component={Auth(UserInfoMainPage, false)}/>
          <Route exact path='/modify/settings' component={Auth(UserUpdatePage, true)}/>
          <Route exact path='/modify/changePW' component={Auth(UserChangePasswordPage, null)}/>
          <Route exact path='/contest' component={Auth(ContestListPage, null)}/>
          <Route exact path='/contest/:contestId' component={Auth(ContestDetailPage, true)}/>
          <Route exact path='/feature' component={Auth(FindFeaturePage, null)}/>
          <Route exact path='/rank' component={Auth(RankPage, true)}/>

          <Route exact path='/:designer' component={Auth(BlogPage_Prod_About, null)}/>
          <Route exact path='/:designer/works' component={Auth(BlogPage_Prod_Works, null)}/>
          <Route exact path='/:designer/likes' component={Auth(BlogPage_Prod_Likes, null)}/>
          <Route exact path='/:designer/cons/likes' component={Auth(BlogPage_Cons_Likes, null)}/>
          <Route exact path='/:designer/cons' component={Auth(BlogPage_Cons_Event, null)}/>


          <Route exact path='/changePassword/1' component={Auth(ChangePasswordPage, null)}/>
          <Route exact path='/changePassword/2/:uid/:token' component={Auth(ChangePasswordPage2, null)}/>
        </Switch>
        </div>
      </div>
      <Route path="/" component={Auth(VoteDetailPage, null)}/>
      <Route path="/:designer" component={Auth(VoteDetailPage, null)}/>
      <Route path="/:designer/works" component={Auth(VoteDetailPage, null)}/>
      <Route path="/:designer/likes" component={Auth(VoteDetailPage, null)}/>
      <Route path="/:designer/cons/likes" component={Auth(VoteDetailPage, null)}/>
      <Route path="^/(?!.*(/login|/register|/checkEmail|/changePassword|/modify)).*$" component={Footer}/>
    </Router>
    </Suspense>
  );
}

export default App;
