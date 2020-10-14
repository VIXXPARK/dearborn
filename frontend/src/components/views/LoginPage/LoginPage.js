import React, { useState } from 'react';
import {Typography, Form, Input, Button} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import './LoginPage.css'
import { useDispatch } from 'react-redux';

import {loginUser} from '../../../_actions/user_action'

const { Title } =Typography;


function LoginPage(props) {

    const dispatch = useDispatch()
    const rememberEmailChecked = localStorage.getItem('rememberEmail') ? true : false

    const [RememberEmail, setRememberEmail] = useState(rememberEmailChecked)

    const handleRememberEmail = () =>{
        setRememberEmail(!RememberEmail)
    }

    const LoginForm = () =>{
        const {control, register, handleSubmit} = useForm();

        const onSubmit = data =>{
            console.log(data)
            dispatch(loginUser(data))
            .then(response =>{
                console.log(response.payload)
                if(response.payload.success){
                    if(!response.payload.isActive){
                        props.history.push('/checkEmail')
                    }else{
                        window.localStorage.setItem('userId', response.payload.userId)
                        if(RememberEmail){
                            window.localStorage.setItem('rememberEmail', data.email)
                        }else{
                            localStorage.removeItem('rememberEmail')
                        }
                        props.history.push('/')
                    }
                }else{
                    alert('알수 없는 오류')
                }
            })
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    as={
                        <Form.Item
                            label="E-mail"
                            
                        >
                            <Input type="text" defaultValue={window.localStorage.getItem('rememberEmail')}/>
                        </Form.Item>
                    }
                    name="email"
                    control={control}
                    defaultValue={window.localStorage.getItem('rememberEmail')}
                />
                <Controller
                    as={
                        <Form.Item
                            label="패스워드"
                            
                        >
                            <Input type="password"/>
                        </Form.Item>
                    }
                    name="password"
                    control={control}
                />
                
                <div style={{float:'left', marginLeft:'1rem'}}>
                    <input type="checkbox" onChange={handleRememberEmail} checked={RememberEmail}></input>
                    <label> remember Email</label>
                </div><br/>
                <input type="submit"></input>
                <div style={{marginTop:'20px', borderTop:'1px solid gray'}}>
                    <a href>비밀번호 찾기</a><br/>
                    <a href="/register">회원가입</a>
                </div>
            </form>
        )
    }

    return (
        <div className="auth">
            <div className="auth-wrapper">
                <p style={{fontSize:'40px', fontWeight:'bold'}}><a href="/">DEarborn</a></p>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                    {LoginForm()}
                </section>
            </div>
        </div>
    );
}

export default LoginPage;