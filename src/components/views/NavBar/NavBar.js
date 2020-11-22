import React, { useEffect, useState } from 'react';

import './Sections/NavBar.css'
import { useSelector } from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {USER_SERVER} from '../../Config'

import {logoutUser} from '../../../_actions/user_action'
import { Avatar, Button, Drawer, Dropdown, Menu, Modal, Typography, Input, Form, Badge } from 'antd';
import {MenuOutlined, MailOutlined} from '@ant-design/icons'
import Logo from '../../assets/Logo.png'
import {getCookieValue} from '../../utils/Cookie'
import {convertToS3EP} from '../../utils/String'
const {confirm} = Modal
const {Title} = Typography

function NavBar(props) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.user)
    const [MessageVisible, setMessageVisible] = useState(false)
    const [Visible, setVisible] = useState(false)
    const [MessageBox, setMessageBox] = useState(-1)
    const [Messages, setMessages] = useState([])

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.get('/api/message/getMessage', config)
        .then(response => {
            console.log(response)
            if(response.data.success){
                setMessages(response.data.messages)
            }else{
                console.log(response.data.err)
            }
        })
    }, [])
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

    const sendMessage = ()=>{

    }

    const showMessage = ()=>{

    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const renderMessageBox = (message, i) => {

        const onFinish = (value) =>{
            console.log(value)
            /*
            const variables = {
                message : value.message,
                userFrom : user.userData._id,
                userTo : message.fromId,
            }
            const config = {
                headers : {
                    Authorization: `Token ${getCookieValue('w_auth')}`
                }
            }
            axios.post('/api/message/saveMessage', variables, config)
            .then(response => {
                if(response.data.success){
                    alert('성공')
                }else{
                    alert('실패')
                }
            })*/
            setMessageBox(-1)
        }
        const showMessage = () =>{
            if(MessageBox === -1){
                setMessageBox(i)
            }
            else{
                setMessageBox(-1)
            }
        }
        return (<div>
            <div className="message-head-content" onClick={showMessage}>
                {message.fromNickname}님이 보낸 메시지(!)
            </div>
            {i === MessageBox && <div className="message-content-show"><div className="message-content-span">
                {message.date}
            </div>
            <div className="message-content-content">
                <div style={{margin:'30px auto'}}>
                    {message.message}
                </div>
            </div>
            </div>}
            </div>)
    }

    const menu = (
        <Menu>
            <Menu.Item>
                {user.userData && user.userData.nickname ? user.userData.job === 1 ? <a href={`/${user.userData.nickname}`}>마이 블로그</a> : <a href={`/${user.userData.nickname}/cons`}>마이 블로그</a>: null}
            </Menu.Item>
            <Menu.Item>
                <a href='/modify'>개인정보 수정</a>
            </Menu.Item>
        </Menu>
    )

    const message = (
        <div className="message-container" style={{boxShadow:'5px 5px 5px gray'}}>
            <div style={{height:'50px', fontFamily:'font1',marginLeft:'20px', marginRight:'20px',fontSize:'15px',lineHeight:'50px', borderBottom : '1px solid #e5e5e5'}}>
                Messanger
            </div>
            {Messages && Messages.map((message, i) =>renderMessageBox(message, i))}
        </div>
    )

    const handleVisible = (flag) => {
        setMessageVisible(flag)
    }

    return (
        <>
        <header id="header" style={{borderBottom:'1px solid whitesmoke', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 4px 0px, rgb(217, 217, 217) 0px 1px 0px 0px'}}>
            <div className="container" style={{maxWidth:'1400px', margin:'0 auto'}}>
                <div>
                    <div className="header-title"><a href="/"><img style={{height:'66px', marginBottom:'17px'}} className="main-logo" src={Logo}/></a></div>
                    <div style={{display:'inline-block', width:'calc(100% - 160px)',height:'100px'}}>
                        <div style={{height:'40px', backgroundColor:'whitesmoke'}}>
                        {user.userData && !user.userData.isAuth ?
                            (<>
                            <div className="register pull-right"><a href="/register"><div className="navbar-button">회원가입</div></a></div>
                            <div className="logged-out pull-right" style={{marginRight:'5px'}}>로그인하세요<a href="/login"><div className="navbar-button">로그인</div></a></div>
                            </>) :
                            (<>
                            <div className="logged-out pull-right"><a onClick={logoutHandler}><div className="navbar-button">로그아웃</div></a></div>
                            </>)}
                        </div>
                        <a className="header-a" id={props.location.pathname === '/contest' ? "header-clicked" : null} href="/contest">Contest</a>
                        <a className="header-a" id={props.location.pathname === '/rank' ? "header-clicked" : null} href="/rank">Rank</a>
                        <div className="row-log">
                            {(<>
                            <div className="nav-bar-profile pull-right">
                                {user.userData && user.userData.job ===1 &&<div className="register pull-right" style={{marginRight:'5px'}}>
                                    <a href="/upload"><div className="navbar-button" style={{backgroundColor:'#f85272', color:'white', marginLeft:'30px', fontSize:'12px', borderRadius:'30px'}}>업로드</div></a>
                                </div>}
                                <Dropdown overlay={message} placement="bottomRight" arrow trigger={["click"]} 
                                onVisibleChange={handleVisible} visible={MessageVisible} overlayStyle={{borderRadius:'20px'}}>
                                    <Badge count={Messages.length}>
                                        <MailOutlined style={{marginTop:'2px', fontSize:'30px', verticalAlign: 'middle',}}/>
                                    </Badge>
                                </Dropdown>
                                <Dropdown overlay={menu} placement="bottomLeft" arrow trigger={["click"]}>
                                    <Avatar style={{ marginTop:'5px',marginLeft:'20px',backgroundColor: '#809edf', verticalAlign: 'middle', fontSize:'20px', lineHeight:'25px' }} src={user.userData && user.userData.profileImage && convertToS3EP(user.userData.profileImage)} size="middle" gap={4}>
                                        {user.userData && !user.userData.profileImage && user.userData.nickname ? user.userData.nickname[0] : null}
                                    </Avatar>
                                </Dropdown>
                            </div>
                            </>)
                            }
                        </div>
                    </div>
                    <Button className="drawer" type="primary" onClick={showDrawer}>
                        <MenuOutlined />
                    </Button>
                    <Drawer
                        closable={false}
                        onClose={onClose}
                        visible={Visible}
                    >
                        {user.userData && user.userData.isAuth ? (
                            <>
                            <Avatar style={{ backgroundColor: '#809edf', verticalAlign: 'middle', fontSize:'20px', lineHeight:'25px', float:'left' }} size="middle" gap={4}>
                                {user.userData.nickname ? user.userData.nickname[0] : null}
                            </Avatar>
                            <div>
                                <p style={{fontSize:'30px', lineHeight:'20px', marginLeft:'50px'}}>{user.userData.nickname}님</p>
                                <p style={{fontSize:'15px', marginLeft:'50px'}}>/ {user.userData.job===1 ? "창작자" : "클라이언트"}</p>
                            </div>
                            <div style={{marginTop:'30px'}}>
                                <a style={{fontSize:'20px'}} href="/contest">Contest</a>
                            </div>
                            <div style={{marginTop:'30px'}}>
                                <a style={{fontSize:'20px'}} href="/repo">Storage</a>
                            </div>
                            <div style={{marginTop:'50px',textAlign:'center'}}>
                                <a style={{fontSize:'20px', color:'black'}} href={`/${user.userData.nickname}`}>마이 블로그</a>
                            </div>
                            <div style={{marginTop:'20px',textAlign:'center', marginBottom:'20px'}}>
                                <a style={{fontSize:'20px', color:'black'}} href="/modify">개인정보 수정</a>
                            </div>
                            <div className="logged-out pull-right"><a onClick={logoutHandler}><div className="navbar-button">로그아웃</div></a></div>
                            {user.userData && user.userData.job ===1 &&<div className="register pull-right">
                                <a href="/upload"><div className="navbar-button">업로드</div></a>
                            </div>}
                            </>
                            ) : (
                                <>
                                <div style={{marginTop:'30px'}}>
                                    <a style={{fontSize:'20px'}} href="/contest">Contest</a>
                                </div>
                                <div style={{marginTop:'30px'}}>
                                    <a style={{fontSize:'20px'}} href="/repo">Storage</a>
                                </div>
                                <div style={{marginTop:'50px',textAlign:'center'}}>
                                    <a style={{fontSize:'20px', color:'black'}} href="/">마이 블로그</a>
                                </div>
                                <div style={{marginTop:'20px',textAlign:'center'}}>
                                    <a style={{fontSize:'20px', color:'black'}} href="/repo">쪽지 확인</a>
                                </div>
                                <div style={{marginTop:'20px',textAlign:'center', marginBottom:'20px'}}>
                                    <a style={{fontSize:'20px', color:'black'}} href="/repo">개인정보 수정</a>
                                </div>
                                <div className="logged-out pull-right"><a href="/login"><div className="navbar-button">로그인</div></a></div>
                                <div className="register pull-right"><a href="/register"><div className="navbar-button">회원가입</div></a></div>
                                </>
                            )
                        }
                    </Drawer>
                </div>
            </div>
        </header>
        </>
    );
}

export default NavBar;