import React, { useState } from 'react';

import './Sections/NavBar.css'
import { useSelector } from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {USER_SERVER} from '../../Config'

import {logoutUser} from '../../../_actions/user_action'
import { Avatar, Button, Drawer, Dropdown, Menu, Modal, Typography, Input } from 'antd';
import {MenuOutlined} from '@ant-design/icons'
import Dearborn from '../../assets/Dearborn.png'
import {getCookieValue} from '../../utils/Cookie'
const {confirm} = Modal
const {Title} = Typography

function NavBar(props) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    const [Visible, setVisible] = useState(false)
    const [MessageBox, setMessageBox] = useState(false)
    const [Messages, setMessages] = useState([])

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

    const renderMessage = (message) => {

        const OpenMessageForm = () => {
            var HireMessage
            confirm({
                width:800,
                icon:null,
                content: 
                <div className="bid-container">
                    <div className="hire-title">{message.fromNickname} 에게 답장</div>
                    <div className="hire-content">메시지<br/><Input.TextArea style={{fontSize:'20px'}} rows={5}  onChange={(e)=>{HireMessage = e.currentTarget.value}}/></div>
                </div>,
                okText: "메시지 전송",
                cancelText: "취소",
                onOk(){
                    const variables = {
                        message : HireMessage,
                        userFrom : props.user.userData._id,
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
                    })
                }
            })
        }

        return (
            <tr>
                <td>{message.fromNickname}</td><td>{message.message}</td><td>{message.date}</td><td><Button style={{width:'55px', textAlign:'center'}} onClick={OpenMessageForm}>답장</Button></td>
            </tr>
        )
    }

    const renderMessageBox = () =>{
        return (
        <>
        <div className="message-modal-background" onClick={closeMessageBox}/>
        <div className="message-container">
            <Title>쪽지 확인</Title>
            <p style={{textAlign:'right'}}>메시지는 30개까지 저장됩니다.</p>
            <div className="message-form">
                <table className="message-table">
                    <thead className="message-thead">
                        <tr>
                            <th>보낸 사람</th><th>내용</th><th>받은 일시</th><th></th>
                        </tr>
                    </thead>
                    <tbody className="message-tbody">
                        {Messages && Messages.map(message => renderMessage(message))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
        )
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const showMessageBox = () => {
        const config = {
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
        })
        setMessageBox(true)

    }

    const closeMessageBox = () => {
        setMessageBox(false)
    }

    const menu = (
        <Menu>
            <Menu.Item>
                {user.userData && user.userData.nickname ? user.userData.job === 1 ? <a href={`/${user.userData.nickname}`}>마이 블로그</a> : <a href={`/${user.userData.nickname}/cons`}>마이 블로그</a>: null}
            </Menu.Item>
            <Menu.Item>
                <a onClick={showMessageBox}>쪽지 확인</a>
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
                    <a className="header-a" href="/contest">Contest</a>
                    <a className="header-a" href="/membership">Storage</a>
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
                                <a style={{fontSize:'20px', color:'black'}} href="/">마이 블로그</a>
                            </div>
                            <div style={{marginTop:'20px',textAlign:'center'}}>
                                <a style={{fontSize:'20px', color:'black'}} href="/repo">쪽지 확인</a>
                            </div>
                            <div style={{marginTop:'20px',textAlign:'center', marginBottom:'20px'}}>
                                <a style={{fontSize:'20px', color:'black'}} href="/repo">개인정보 수정</a>
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
        {MessageBox && renderMessageBox()}
        </>
    );
}

export default NavBar;