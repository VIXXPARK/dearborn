import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

import './MessagePage.css'
import {Button, Input, Typography, Modal} from 'antd'
import {getCookieValue} from '../../utils/Cookie'

const {confirm} = Modal
const {Title} = Typography

function MessagePage(props) {

    const [Messages, setMessages] = useState([])

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.get('/api/message/getMessage', config)
        .then(response => {
            if(response.data.success){
                setMessages(response.data.messages)
            }
        })
    }, [])

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

    return (
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
    );
}

export default MessagePage;