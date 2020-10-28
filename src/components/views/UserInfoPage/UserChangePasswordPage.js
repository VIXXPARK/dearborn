import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'

function UserChangePasswordPage(props) {

    const onFinish = (value)=> {
        
    }

    return (
        <div className="auth" style={{marginTop:'200px'}}>
            <div className="auth-wrapper" style={{paddingTop:'20px'}}>
                <p style={{fontSize:'40px', fontWeight:'bold'}}><a href="/">DEarborn</a></p>
                <div style={{borderRadius:'20px', border:'1px solid black'}}>
                    <Form
                        onFinish={onFinish}
                    >
                        <p></p>
                        <Form.Item
                            name="checkpassword"
                        >
                            <Input/>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default UserChangePasswordPage;