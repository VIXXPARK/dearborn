import React, { useState } from 'react';
import {Typography, Form, Input, Button} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import axios from 'axios'
import './LoginPage.css'

const { Title } =Typography;

function ChangePasswordPage(props) {

    const uid = props.match.params.uid
    const token = props.match.params.token

    const ChangePasswordForm = () =>{
        const {control, register, handleSubmit} = useForm();

        const onSubmit = data =>{
            if(data.password !== data.password2){
                return alert('다시 한번 확인해주세요')
            }
            let variable = {
                uid : uid,
                token : token,
                password : data.password
            }
            axios.post('/api/user/changePassword', variable)
            .then(response => {
                if(response.data.success){
                    alert('비밀번호 변경 성공')
                    props.history.push('/login')
                }else{
                    alert('비밀번호 변경 실패')
                }
            })
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    as={
                        <Form.Item
                            label="변경할 패스워드"
                            
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
                            label="변경할 패스워드 확인"
                            
                        >
                            <Input type="password"/>
                        </Form.Item>
                    }
                    name="password2"
                    control={control}
                />
                <br/>
                <input type="submit"></input>
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