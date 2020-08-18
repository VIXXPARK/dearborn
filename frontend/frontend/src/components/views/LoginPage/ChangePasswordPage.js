import React, { useState } from 'react';
import {Typography, Form, Input, Button} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import axios from 'axios'
import './LoginPage.css'

const { Title } =Typography;

function ChangePasswordPage(props) {

    const ChangePasswordForm = () =>{
        const {control, register, handleSubmit} = useForm();

        const onSubmit = data =>{
            alert('이메일을 보냈습니다.')
            axios.post('/api/user/sendChangeEmail', {email : data.email})
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    as={
                        <Form.Item
                            label="Email"
                            
                        >
                            <Input type="text"/>
                        </Form.Item>
                    }
                    name="email"
                    control={control}
                />
                <br/>
                <input type="submit" value="이메일 전송"></input>
            </form>
        )
    }

    return (
        <div>
            <div className="auth">
            <div className="auth-wrapper">
                <Title level={2}><a href="/">DEarborn</a></Title>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                    {ChangePasswordForm()}
                </section>
            </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;