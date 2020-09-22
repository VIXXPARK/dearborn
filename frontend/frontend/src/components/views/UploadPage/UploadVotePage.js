import React, { useState } from 'react';

import {Form, Input, Upload, Button, Descriptions, Radio} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'
import styles from './customstyle.css'
import './UploadVotePage.css'


function UploadVotePage(props) {

    //upload
    const [FileList, setFileList] = useState([])
    const [ThumbnailFile, setThumbnailFile] = useState('')
    const [ThumbnailUrl, setThumbnailUrl] = useState('')
    const [ThumbLoading, setThumbLoading] = useState(false)
    const [Category, setCategory] = useState(0)
    
    //other

    const OnCategoryClick = (e) =>{
        setCategory(e)
    }

    //upload


    const getBase64 = (file) => {
        console.log(1)
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    function getThumbBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }
    const onFinish = (values) => {
        console.log(values)
        console.log(ThumbnailFile)
        console.log(FileList);
        let formData = new FormData()
        const config = {
            header : {'Content-Type' : 'multipart/form-data'}
        }
        FileList.forEach(file => formData.append('images', file.originFileObj))
        formData.append('title', values.title)
        formData.append('content', values.description)
        formData.append('thumbnail', ThumbnailFile)
        formData.append('category', Category)
        formData.append('sell', values.sell)
        formData.append('scope', values.scope)
        formData.append('user', window.localStorage.getItem('userId'))
        axios.post('/api/post/uploadPost', formData,config)
            .then(response => {
                console.log(response)
                if(response.data.success)
                {
                    alert('성공')
                    props.history.push('/')
                }
                else{
                    console.log(response)
                    return alert('페이지 업로드 실패')
                }
        })

    }

    const handleRemove = (file) =>{
        const index = FileList.indexOf(file)
        const newFileList = FileList.slice()
        newFileList.splice(index, 1)

        setFileList(newFileList)
    }

    const handleThumbRemove = ()=> {
        setThumbnailUrl(null)
    }

    const handleChange = async (info) => {
        if(!info.file.preview){
            console.log(1)
            info.file.preview = await getBase64(info.file.originFileObj)
        }
        setFileList(info.fileList)
    }

    const handleThumbChange = (info) => {
        if (info.file.status === 'uploading') {
          setThumbLoading(true)
          return;
        }
        else{
          getThumbBase64(info.file.originFileObj, imageUrl =>{
            setThumbnailUrl(imageUrl)
            setThumbLoading(false)
          });
          setThumbnailFile(info.file.originFileObj)
        }
      };
    
    const uploadButton = (
        <div className="upload-block">
            <PlusOutlined />
            <div className="ant-upload-text">디자인 업로드</div>
        </div>
      );

    const uploadThumbButton = (
        <div className="upload-block">
            <PlusOutlined />
            <div className="ant-upload-text">썸네일 업로드</div>
        </div>
    )
    //other


    return (
        <div className="upload-container">
            <div className="upload-left-container">
                <Upload
                    listType="picture-card"
                    onPreview={false}
                    onRemove={handleThumbRemove}
                    onChange={handleThumbChange}
                    showUploadList={false}
                >
                    {ThumbnailUrl ? <img src={ThumbnailUrl} style={{width:'300px', height:'600px', backgroundColor:'white'}}/> : uploadThumbButton}
                </Upload>
                {FileList && FileList.map((file, i)=>(
                    <div key={i} className="upload-block-prev">
                        <img style={{width:'300px',height:'600px', backgroundColor:'white'}} src={file.preview}/>
                    </div>
                ))}
                <Upload
                    listType="picture-card"
                    fileList={FileList}
                    onRemove={handleRemove}
                    onChange={handleChange}
                    showUploadList={false}
                >
                    {FileList.length >= 8 ? null : uploadButton}
                </Upload>
            </div>
            <div className="upload-right-container">
                <Form onFinish={onFinish}>
                    <div className="upload-left-block-container">
                        <Form.Item
                            
                            name="title"
                            rules={[{required:true, message:'제목을 써주시기 바랍니다'}]}    
                        >
                            <Input

                                className="upload-title-input"
                                style={{width:'350px', fontSize:'25px'}}
                                placeholder="제  목"
                            />
                        </Form.Item>
                        <Form.Item
                            className="upload-desc-textarea"
                            name="description"
                        >
                            <Input.TextArea
                                className="upload-desc-textarea"
                                rows={5}
                                placeholder="제  목"
                            />
                        </Form.Item>
                        <div className="upload-left-bottom-container">
                            <label style={{fontSize:'40px'}}>카테고리</label>
                            <ul>
                                <div className="category-first-btn">
                                <h1>의류</h1>
                                <ul className="category-second-wrapper1">
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={1}>상의</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={2}>하의</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={3}>모자</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={4}>아우터</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={5}>속옷</li>
                                </ul>
                                </div>
                                <div className="category-first-btn">
                                <h1>악세서리</h1>
                                <ul className="category-second-wrapper2">
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={6}>귀걸이</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={7}>시계</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={8}>목걸이</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={9}>발찌</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={10}>팔찌</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={11}>안경</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={12}>반지</li>
                                </ul>
                                </div>
                                <div className="category-first-btn">
                                <h1>신발</h1>
                                <ul className="category-second-wrapper3">
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={13}>단화</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={14}>스포츠</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={15}>슬리퍼</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={16}>샌들</li>
                                    <li className="category-second-btn" onClick={OnCategoryClick} value={17}>하이힐</li>
                                </ul>
                                </div>
                            </ul>
                            <label>판매 여부</label>
                            <Form.Item
                                style={{marginTop:'50px'}}
                                name="sell"
                            >
                                <Radio.Group style={{width:'500px', height:'50px'}} defaultValue={1}>
                                    <Radio.Button className="scope-radio-button" value={1}>수락</Radio.Button>
                                    <Radio.Button className="scope-radio-button" value={2}>거절</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <label>공개 범위</label>
                            <Form.Item
                                style={{marginTop:'50px'}}
                                name="scope"
                            >
                                <Radio.Group style={{width:'500px', height:'50px'}} defaultValue={1}>
                                    <Radio.Button className="scope-radio-button" value={1}>Public</Radio.Button>
                                    <Radio.Button className="scope-radio-button" value={2}>Private</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button className="submit-btn" type="primary" htmlType="submit" block>
                                    제출
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default UploadVotePage;