import React, { useState } from 'react';

import './Sections/NavBar.css'
import { useSelector } from 'react-redux';
import Axios from 'axios';
import {useDispatch} from 'react-redux'
import {USER_SERVER} from '../../Config'

import {logoutUser} from '../../../_actions/user_action'
import { Avatar, Button, Drawer, Dropdown, Menu } from 'antd';
import {MenuOutlined} from '@ant-design/icons'
import Dearborn from '../../assets/Dearborn.png'

function NavBar(props) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    const [Visible, setVisible] = useState(false)

    const logoutHandler = () =>{
        dispatch(logoutUser()).then(response =>{
            if(response.payload.success){
                props.history.push('/login')
                window.localStorage.setItem('userId', "")
            }else{
                console.log(response.payload.err)
            }
        })
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const menu = (
        <Menu>
            <Menu.Item>
                {user.userData && user.userData.nickname ? user.userData.job === 1 ? <a href={`/${user.userData.nickname}`}>마이 블로그</a> : <a href={`/${user.userData.nickname}/cons`}>마이 블로그</a>: null}
            </Menu.Item>
            <Menu.Item>
                <a href='/message'>쪽지 확인</a>
            </Menu.Item>
            <Menu.Item>
                <a href='/modify'>개인정보 수정</a>
            </Menu.Item>
        </Menu>
    )

    return (
        <>
        <header id="header">
            <div className="container">
                <div>
                    <div className="header-title"><a href="/"><img style={{marginTop:'11px'}} className="main-logo" src={Dearborn}/></a></div>
                    <a className="header-a" href="/contest">contest</a>
                    <a className="header-a" href="/membership">membership</a>
                    <div className="row-log">
                        {user.userData && !user.userData.isAuth ?
                        (<>
                        <div className="register pull-right"><a href="/register"><div className="navbar-button">회원가입</div></a></div>
                        <div className="logged-out pull-right">로그인하세요<a href="/login"><div className="navbar-button">로그인</div></a></div>
                        </>) :
                        (<>
                        <div className="logged-out pull-right"><a onClick={logoutHandler}><div className="navbar-button">로그아웃</div></a></div>
                        {user.userData && user.userData.job ===1 &&<div className="register pull-right">
                            <a href="/upload"><div className="navbar-button">업로드</div></a>
                        </div>}
                        <div className="nav-bar-profile pull-right">
                            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                                <Avatar style={{ backgroundColor: '#809edf', verticalAlign: 'middle', fontSize:'20px', lineHeight:'26px' }} size="middle" gap={4}>
                                    {user.userData && user.userData.nickname ? user.userData.nickname[0] : null}
                                </Avatar>
                            </Dropdown>
                        </div>
                        </>)
                        }
                    </div>
                    <Button className="drawer" type="primary" onClick={showDrawer}>
                        <MenuOutlined />
                    </Button>
                    <Drawer
                        closable={false}
                        onClose={onClose}
                        visible={Visible}
                    >

                    </Drawer>
                </div>
            </div>
        </header>
        </>
    );
}

export default NavBar;