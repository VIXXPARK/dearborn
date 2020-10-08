import React, { useState, useEffect } from 'react';
import {Typography, Input, Form, Select, Radio, Checkbox, Upload, Button, Avatar} from 'antd'
import {useForm, Controller} from 'react-hook-form'
import '../LoginPage/LoginPage.css'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import {SmileOutlined, UserOutlined} from '@ant-design/icons';


import TextArea from 'antd/lib/input/TextArea';

const { Title } =Typography
const {Option} = Select

function UserUpdatePage(props) {
    const dispatch = useDispatch()

    const {control, register, handleSubmit} = useForm();

    const [Job, setJob] = useState("1")
    const [Major, setMajor] = useState([1])
    const [ProfileImage, setProfileImage] = useState("")
    const [Preview, setPreview] = useState("")
    const [Content, setContent] = useState("")
    useEffect(() => {
        axios.get('/api/user/getUser')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setJob(response.data.user.job)
                setMajor(response.data.user.major.split(':'))
                setPreview(response.data.user.profileImage)
                setContent(response.data.user.content)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])
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
        console.log(data)
        formData.append('uId', props.user.userData._id)
        formData.append('file', ProfileImage)
        formData.append('content', data.content)
        formData.append('major', tempMajor)
        formData.append('job', data.job)
        const config = {
            header : {'Content-Type' : 'multipart/form-data'}
        }
        axios.post('/api/user/modify', formData, config)
        .then(response => {
            if(response.data.success){
                props.history.push('/modify')
            }else{
                alert('실패')
            }
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
        <div className="auth">
            <div className="auth-wrapper" style={{paddingTop:'20px'}}>
                <Title level={2}><a href="/">DEarborn</a></Title>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                {Job === 1 &&
                <>
                <label>자신 있는 분야 : </label><br/><br/>
                <Checkbox.Group
                    onChange={clickMajor}
                    value={Major}
                >
                    <Checkbox value={'1'}>없음</Checkbox>
                    <Checkbox value={'2'}>상의</Checkbox>
                    <Checkbox value={'3'}>하의</Checkbox>
                    <Checkbox value={'4'}>모자</Checkbox>
                    <Checkbox value={'5'}>신발</Checkbox>
                    <Checkbox value={'6'}>악세서리</Checkbox>
                </Checkbox.Group>
                </>}
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
                {ProfileImage ?<Avatar src={Preview} /> : <Avatar src={`http://localhost:8000${Preview}`} />}
                </div>
                <br/><br/>자기소개<br/><br/>
                <Controller
                    as={
                        <TextArea autoSize={{minRows:5}} defaultValue={Content}/>
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
                </section>
            </div>
        </div>
    );
}

export default UserUpdatePage;
