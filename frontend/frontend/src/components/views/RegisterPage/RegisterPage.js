import React, { useState } from 'react';
import {Typography, Input, Form, Select, Radio, Checkbox, Upload, Button, Avatar} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import '../LoginPage/LoginPage.css'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import {SmileOutlined, UserOutlined} from '@ant-design/icons';


import {registerUser} from '../../../_actions/user_action'
import TextArea from 'antd/lib/input/TextArea';

const { Title } =Typography
const {Option} = Select

function RegisterPage(props) {
    const dispatch = useDispatch()

    const {control, register, handleSubmit} = useForm();

    const [Job, setJob] = useState(1)
    const [Major, setMajor] = useState([1])
    const [ProfileImage, setProfileImage] = useState("")
    const [Preview, setPreview] = useState("")

    const RegisterForm = () =>{

        function getBase64(file){
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = error => reject(error);
            });
        }
        const handleChange = async (info) => {
            setProfileImage(info.file.originFileObj)
            let preview = await getBase64(info.file.originFileObj)
            setPreview(preview)
            console.log(Preview)
        }

        const onSubmit = data =>{
            let formData = new FormData()
            let tempMajor = Major.join(':')
            data.major = tempMajor
            formData.append('profileImage', ProfileImage)
            formData.append('content', data.content)
            formData.append('major', tempMajor)
            formData.append('email', data.email)
            formData.append('password', data.password)
            formData.append('job', data.job)
            formData.append('nickname', data.nickname)
            
            alert('이메일 인증을 확인해주세요')
            if(data.confirmPassword !== data.password){
                return alert("2차 패스워드가 다릅니다.")
            }
            dispatch(registerUser(formData)).then(response =>{
                if(response.payload.success){
                    props.history.push('/login')
                }else{
                    alert(response.payload.err.errmsg)
                }
            })
            axios.post('/api/user/checkEmail', {email : data.email})
            .then(response => {
                if(!response.data.success){
                    return alert('이메일이 이미 있습니다.')
                }
                //이메일 중복이 아닐경우 이메일 체킹
            })
            
        }

        const clickMajor = (value) => {
            console.log(value)
            if(value[value.length-1]===1)
                setMajor([1])
            else if(value[value.length-2]===1)
                setMajor([value[value.length-1]])
            else
                setMajor(value)
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
                <Checkbox.Group
                    onChange={clickMajor}
                    value={Major}
                >
                    <Checkbox value={1}>없음</Checkbox>
                    <Checkbox value={2}>상의</Checkbox>
                    <Checkbox value={3}>하의</Checkbox>
                    <Checkbox value={4}>모자</Checkbox>
                    <Checkbox value={5}>신발</Checkbox>
                    <Checkbox value={6}>악세서리</Checkbox>
                </Checkbox.Group>
                <br/><br />당신의 프로필을 업로드하세요!<br/><br/>
                <Upload
                    name='file'
                    showUploadList={false}
                    onChange={handleChange}
                >
                    <Button>
                        <SmileOutlined />
                    </Button>
                </Upload>
                <div>미리보기<br/>
                {ProfileImage ?<Avatar src={Preview} /> : <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                </div>
                <br/><br/>자기소개<br/><br/>
                <Controller
                    as={
                        <TextArea autoSize={{minRows:5}}/>
                    }
                    name="content"
                    control={control}
                />
                <br/>
                <input type="submit"/>
                <div style={{marginTop:'20px', borderTop:'1px solid gray'}}>
                    <a href="/login">로그인</a><br/>
                </div>
            </form>
        )
    }

    return (
        <div className="auth">
            <div className="auth-wrapper" style={{paddingTop:'20px'}}>
                <Title level={2}><a href="/">DEarborn</a></Title>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                    {RegisterForm()}
                </section>
            </div>
        </div>
    );
}

export default RegisterPage;