import React from 'react';
import {useForm, Controller} from 'react-hook-form'
import { Input, Form , Typography } from 'antd';
import axios from 'axios'

const { Title } =Typography;

function CheckImage(props) {

    const CheckEmailForm = () =>{
        const {control, register, handleSubmit} = useForm();

        const onSubmit = data =>{
            console.log(data)
            axios.post('/api/user/checkEmail', {email : data.email})
            props.history.push('/')
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    as={
                        <Form.Item
                            label="E-mail 인증"
                            
                        >
                            <Input type="text"/>
                        </Form.Item>
                    }
                    name="email"
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
                        {CheckEmailForm()}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default CheckImage;