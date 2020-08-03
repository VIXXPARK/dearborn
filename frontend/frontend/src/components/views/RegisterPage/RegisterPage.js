import React, { useState } from 'react';
import {Typography, Input, Form, Select, Radio, Checkbox} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import '../LoginPage/LoginPage.css'
import {useDispatch} from 'react-redux'
import axios from 'axios'

import {registerUser} from '../../../_actions/user_action'

const { Title } =Typography
const {Option} = Select

function RegisterPage(props) {
    const dispatch = useDispatch()

    const {control, register, handleSubmit} = useForm();

    const [Job, setJob] = useState(1)
    const [Major, setMajor] = useState(1)

    const RegisterForm = () =>{


        const onSubmit = data =>{
            console.log(data)
            if(data.confirmPassword !== data.password){
                return alert("2차 패스워드가 다릅니다.")
            }
            axios.post('/api/user/checkEmail', {email : data.email})
            .then(response => {
                if(!response.data.success){
                    return alert('이메일이 이미 있습니다.')
                }
                //이메일 중복이 아닐경우 이메일 체킹
            })
            dispatch(registerUser(data)).then(response =>{
                if(response.payload.success){
                    props.history.push('/login')
                }else{
                    alert(response.payload.err.errmsg)
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
                            <Input type="text"/>
                        </Form.Item>
                    }
                    name="email"
                    control={control}
                    
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
                <Controller
                    as={
                        <Form.Item
                            label="다시 확인"
                            
                        >
                            <Input type="password"/>
                        </Form.Item>
                    }
                    name="confirmPassword"
                    control={control}
                />
                <Controller
                    as={
                        <Form.Item
                            label="닉네임"
                            
                        >
                            <Input type="text"/>
                        </Form.Item>
                    }
                    name="nickname"
                    control={control}
                />
                <label>직종 : </label>
                <Controller
                    as={
                        <Select style={{width:120}}>
                            <Option value="1">무관</Option>
                            <Option value="2">학생</Option>
                            <Option value="3">디자이너</Option>
                        </Select>
                    }
                    name="job"
                    control={control}
                    defaultValue="1"
                />
                <br/><br/>
                <label>자신 있는 분야 : </label><br/><br/>
                <Controller
                    as={
                        <Checkbox.Group>
                            <Checkbox value={1}>없음</Checkbox>
                            <Checkbox value={2}>상의</Checkbox>
                            <Checkbox value={3}>하의</Checkbox>
                            <Checkbox value={4}>모자</Checkbox>
                            <Checkbox value={5}>신발</Checkbox>
                            <Checkbox value={6}>악세서리</Checkbox>
                        </Checkbox.Group>
                    }
                    name="major"
                    control={control}
                    defaultValue="1"
                />
                <input type="submit"/>
                <div style={{marginTop:'20px', borderTop:'1px solid gray'}}>
                    <a href="/login">로그인</a><br/>
                </div>
            </form>
        )
    }

    return (
        <div className="auth">
            <div className="auth-wrapper">
                <Title level={2}><a href="/">DEarborn</a></Title>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                    {RegisterForm()}
                </section>
            </div>
        </div>
    );
}

export default RegisterPage;