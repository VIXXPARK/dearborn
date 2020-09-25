import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

import './MessagePage.css'
import {Button, Input, Typography, Modal} from 'antd'

const {confirm} = Modal
const {Title} = Typography

function MessagePage(props) {

    const [Messages, setMessages] = useState([])

    useEffect(() => {
        axios.get('/api/message/getMessage')
        .then(response => {
            if(response.data.success){
                setMessages(response.data.messages)
            }
        })
    }, [])

    const renderMessage = () => {

        const OpenMessageForm = () => {
            var HireMessage
            confirm({
                width:800,
                icon:null,
                content: 
                <div className="bid-container">
                    <div className="hire-title">{} 에게 답장</div>
                    <div className="hire-content">메시지<br/><Input.TextArea style={{fontSize:'20px'}} rows={5}  onChange={(e)=>{HireMessage = e.currentTarget.value}}/></div>
                </div>,
                okText: "메시지 전송",
                cancelText: "취소",
                onOk(){
                    console.log(HireMessage)
                }
            })
        }

        return (
            <tr>
                <td>Lorem</td><td>Ipsum</td><td>Dolor</td><td><Button style={{width:'55px', textAlign:'center'}} onClick={OpenMessageForm}>답장</Button></td>
            </tr>
        )
    }

    return (
        <div className="message-container">
            <Title>쪽지 확인</Title>
            <div className="message-form">
                <table className="message-table">
                    <thead className="message-thead">
                        <tr>
                            <th>보낸 사람</th><th>내용</th><th>받은 일시</th><th></th>
                        </tr>
                    </thead>
                    <tbody className="message-tbody">
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                        {renderMessage()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MessagePage;