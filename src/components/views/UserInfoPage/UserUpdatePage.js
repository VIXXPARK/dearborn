import React, { useState, useEffect } from 'react';
import {Typography, Input, Form, Select, Radio, Checkbox, Upload, Button, Avatar} from 'antd'
import '../LoginPage/LoginPage.css'
import axios from 'axios'
import {SmileOutlined, UserOutlined} from '@ant-design/icons';
import {convertToS3EP} from '../../utils/String'

import TextArea from 'antd/lib/input/TextArea';

const { Title } =Typography
const {Option} = Select

function UserUpdatePage(props) {

    const [ProfileImage, setProfileImage] = useState("")
    const [Preview, setPreview] = useState("")
    const [Content, setContent] = useState("")
    useEffect(() => {
        axios.get('/api/user/getUser')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setPreview(response.data.user.profileImage)
                setContent(response.data.user.content)
            }else{
                console.log(response.data.err)
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

    const onFinish = data =>{
        let formData = new FormData()
        console.log(data)
        formData.append('uId', props.user.userData._id)
        formData.append('file', ProfileImage)
        formData.append('content', data.content)
        const config = {
            header : {'Content-Type' : 'multipart/form-data'}
        }
        axios.post('/api/user/changeProfile', formData, config)
        .then(response => {
            if(response.data.success){
                props.history.push('/modify')
            }else{
                console.log(response.data.err)
            }
        })
    }

    return (
        <div className="auth">
            <div className="auth-wrapper" style={{paddingTop:'20px'}}>
                <p style={{fontSize:'40px', fontWeight:'bold'}}><a href="/">DEarborn</a></p>
                <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                <Form onFinish={onFinish}
                    initialValues={{
                        content : Content,
                    }}
                >
                당신의 프로필을 업로드하세요!<br/><br/>
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
                {ProfileImage ? <Avatar src={convertToS3EP(Preview)} /> : <Avatar src={`https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU`} />}
                </div>
                <br/><br/>자기소개<br/><br/>
                <Form.Item
                    name="content"
                >
                    <TextArea autoSize={{minRows:5}}/>
                </Form.Item>
        
                <br/>
                <Button style={{width:'100%'}} type="primary" htmlType="submit" block>
                    제출
                </Button>
                </Form>
                </section>
            </div>
        </div>
    );
}

export default UserUpdatePage;
