import React, { useState } from 'react';

import {Form, Input, Upload, Button, Descriptions} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'
import styles from './customstyle.css'

const {TextArea} = Input


function UploadVotePage(props) {

    //upload
    const [PreviewVisible, setPreviewVisible] = useState(false)
    const [PreviewImage, setPreviewImage] = useState('')
    const [FileList, setFileList] = useState([])
    const [PreviewTitle, setPreviewTitle] = useState('')
    const [ThumbnailFile, setThumbnailFile] = useState('')
    const [ThumbnailUrl, setThumbnailUrl] = useState('')
    const [ThumbLoading, setThumbLoading] = useState(false)
    
    //other

    

    //upload


    const getBase64 = (file) => {
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
        let formData = new FormData()
        const config = {
            headers : 
            {
                'Content-Type' : 'multipart/form-data',
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        FileList.forEach(file => formData.append('files', file.originFileObj))
        console.log(formData)
        axios.post('/api/post/uploadImages', formData, config)
        .then(response => {
            if(!response.data.success)
                return alert("이미지 업로드 실패")
            else{
                var temp = response.data.images
                var tempArray = temp.slice(0, temp.length-2).split("&&")
                
                const posts = {
                    writer : props.user.userData._id,
                    title : values.title,
                    content : values.content,
                    images : tempArray,
                    type : 1
                }


                axios.post('/api/post/uploadPost', posts)
                .then(response => {
                    if(response.data.success)
                    {
                        alert('성공')
                        props.history.push('/')
                    }
                    else{
                        return alert('페이지 업로드 실패')
                    }
                })

            }
        })
    }

    const handlePreview = async (file) => {
        if(!file.preview){
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')+1))
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

    const handleCancel = () => setPreviewVisible(false)

    const handleChange = (info) => {
        setFileList(info.fileList)
    }

    const handleThumbChange = (info) => {
        console.log(info.file.status)
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
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    const uploadThumbButton = (
        <div>
            {ThumbLoading ? <LoadingOutlined/> : <PlusOutlined />}
            <div>Upload</div>
        </div>
    )
    //other


    return (
        <div style={{}}>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="title"
                    rules={[{required:true, message:'제목을 써주시기 바랍니다'}]}    
                >
                    <Input 
                        placeholder="제  목"
                    />
                </Form.Item>
                <label>썸네일</label>
                <div className='upload-container' style={{display:'flex'}}>

                <Upload
                    listType="picture-card"
                    onPreview={false}
                    onRemove={handleThumbRemove}
                    onChange={handleThumbChange}
                    showUploadList={false}
                >
                    {ThumbnailUrl ? <img src={ThumbnailUrl} style={{width:'96px', height:'96px'}}/> : uploadThumbButton}
                </Upload>
                <Upload
                    listType="picture-card"
                    fileList={FileList}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    onChange={handleChange}
                >
                    {FileList.length >= 8 ? null : uploadButton}
                </Upload>
                </div>
                <Modal
                    visible={PreviewVisible}
                    title={PreviewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >

                </Modal>
                <Form.Item
                    name="content"
                >
                    <TextArea
                        autoSize={{minRows:5}}
                    >
                </TextArea>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            
        </div>
    );
}

export default UploadVotePage;