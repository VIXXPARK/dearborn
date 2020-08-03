import React from 'react';

import './Sections/NavBar.css'
import MenCategory from './Sections/MenCategory';
import WomenCategory from './Sections/WomenCategory';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import {USER_SERVER} from '../../Config'

function NavBar(props) {

    const user = useSelector(state => state.user)

    const logoutHandler = () =>{
        Axios.get(`${USER_SERVER}/logout`).then(response => {
            if(response.status === 200){
                props.history.push('/login')
            }else{
                alert('logout Failed')
            }
        })
    }

    return (
        <>
        <header id="header">
            <div className="container">
                <div className="row">
                    <div className="header-title"><a href="/">DEarborn</a></div>
                    <div className="row-log">
                        {user.userData && !user.userData.isAuth ?
                        (<>
                        <div className="register pull-right"><a href="/register">회원가입</a></div>
                        <div className="logged-out pull-right"><a href="/login">로그인</a></div>
                        </>) :
                        (<>
                        <div className="logged-out pull-right"><a onClick={logoutHandler}>로그아웃</a></div>
                        <div className="register pull-right"><a href="/upload">업로드</a></div>
                        </>)
                        }
                    </div>
                </div>
            </div>
        </header>
        <nav>
            <div className="menu-container">
                <div className="menu">Men
                    <MenCategory />
                </div>
                <div className="menu">Women
                    <WomenCategory />
                </div>
            </div>
        </nav>
        </>
    );
}

export default NavBar;