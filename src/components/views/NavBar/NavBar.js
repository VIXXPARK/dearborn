import React, { useEffect, useState } from 'react';

import './Sections/NavBar.css'
import { useSelector } from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {USER_SERVER} from '../../Config'

import {logoutUser} from '../../../_actions/user_action'
import { Avatar, Button, Drawer, Dropdown, Menu, Modal, Typography, Input, Form } from 'antd';
import {MenuOutlined, MailOutlined} from '@ant-design/icons'
import Dearborn from '../../assets/Dearborn.png'
import {getCookieValue} from '../../utils/Cookie'
const {confirm} = Modal
const {Title} = Typography

function NavBar(props) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.user)
    const [MessageVisible, setMessageVisible] = useState(false)
    const [Visible, setVisible] = useState(false)
    const [MessageBox, setMessageBox] = useState(-1)
    const [Messages, setMessages] = useState([{
        fromNickname : 'pazbear1',
        message : 'gdgdgdgdgdggd',
        date:'2020.01.01'   
    },{
        fromNickname : 'pazbear2',
        message : 'gdgdgdgdgdggd',
        date:'2020.01.01'   
    },{
        fromNickname : 'pazbear3',
        message : 'gdgdgdgdgdggd',
        date:'2020.01.01'   
    },])

    useEffect(() => {
        /*const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.get('/api/message/getMessage', config)
        .then(response => {
            if(response.data.success){
                setMessages(response.data.messages)
            }else{
                console.log(response.data.err)
            }
        })*/
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
                {message.message}
            </div>
            <Form
                onFinish={onFinish}
            >
                <Form.Item
                    style={{display:'inline-block'}}
                    name="message"
                >
                    <Input.TextArea style={{width:'300px', display:'inline-block'}}/>
                </Form.Item>
                <Form.Item
                    style={{display:'inline-block'}}
                >
                    
                    <Button style={{width:'50px'}} onClick={sendMessage} htmlType="submit">답장</Button>
                </Form.Item>
            </Form></div>}
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
        <div className="message-container">
            <div style={{height:'50px',fontSize:'15px',lineHeight:'40px', borderBottom : '1px solid #e5e5e5'}}>
                받은 메일(messages.length(!))
            </div>
            <div className="message-head-wrapper">
                <div className="message-head" style={{borderBottom:'1px solid #e5e5e5'}}>
                    이름
                </div>
                <div className="message-head2" style={{borderBottom:'1px solid #e5e5e5'}}>
                    내용
                </div>
            </div>
            {Messages && Messages.map((message, i) =>renderMessageBox(message, i))}
        </div>
    )

    const handleVisible = (flag) => {
        setMessageVisible(flag)
    }

    return (
        <>
        <header id="header">
            <div className="container">
                <div>
                    <div className="header-title"><a href="/"><img style={{marginTop:'11px',marginLeft:'50px', marginRight:'50px', height:'40px'}} className="main-logo" src={Dearborn}/></a></div>
                    <a className="header-a" id={props.location.pathname === '/contest' ? "header-clicked" : null} href="/contest">Contest</a>
                    <a className="header-a" id={props.location.pathname === '/repo' ? "header-clicked" : null} href="/repo">Storage</a>
                    <div className="row-log">
                        {user.userData && !user.userData.isAuth ?
                        (<>
                        <div className="register pull-right"><a href="/register"><div className="navbar-button">회원가입</div></a></div>
                        <div className="logged-out pull-right" style={{marginRight:'5px'}}>로그인하세요<a href="/login"><div className="navbar-button">로그인</div></a></div>
                        </>) :
                        (<>
                        <div className="logged-out pull-right" style={{marginRight:'50px'}}><a onClick={logoutHandler}><div className="navbar-button">로그아웃</div></a></div>
                        {user.userData && user.userData.job ===1 &&<div className="register pull-right" style={{marginRight:'5px'}}>
                            <a href="/upload"><div className="navbar-button" >업로드</div></a>
                        </div>}
                        <div className="nav-bar-profile pull-right">
                            <Dropdown overlay={message} placement="bottomRight" arrow trigger={["click"]} 
                            onVisibleChange={handleVisible} visible={MessageVisible} overlayStyle={{border:'1px solid #e5e5e5', borderRadius:'20px'}}>
                                <MailOutlined style={{marginRight:'20px', fontSize:'30px', verticalAlign: 'middle',}}/>
                            </Dropdown>
                            <Dropdown overlay={menu} placement="bottomLeft" arrow trigger={["click"]}>
                                <Avatar style={{ backgroundColor: '#809edf', verticalAlign: 'middle', fontSize:'20px', lineHeight:'25px' }} size="middle" gap={4}>
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