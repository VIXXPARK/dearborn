import React, { useState } from 'react';

import {Form, Input, Upload, Button, Descriptions} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import Modal from 'antd/lib/modal/Modal';

const {TextArea} = Input


function UploadVotePage(props) {

    //upload
    const [PreviewVisible, setPreviewVisible] = useState(false)
    const [PreviewImage, setPreviewImage] = useState('')
    const [FileList, setFileList] = useState([])
    const [PreviewTitle, setPreviewTitle] = useState('')
    
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
    const onFinish = (values) => {
        let formData = new FormData()
        const config = {
            header : {'Content-Type' : 'multipart/form-data'}
        }
        console.log(FileList)
        FileList.forEach(file => formData.append('files', file.originFileObj))


        axios.post('/api/product/uploadImages', formData, config)
        .then(response => {
            if(!response.data.success)
                return alert("이미지 업로드 실패")
            else{
                var temp = response.data.images
                var tempArray = temp.slice(0, temp.length-2).split("&&")
                
                const variables = {
                    writer : props.user.userData._id,
                    title : values.title,
                    content : values.content,
                    images : tempArray
                }


                axios.post('/api/product/uploadProduct', variables)
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

    const handleCancel = () => setPreviewVisible(false)

    const handleChange = (info) => {
        setFileList(info.fileList)
    }
    
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

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
                <Upload
                    listType="picture-card"
                    fileList={FileList}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    onChange={handleChange}
                >
                    {FileList.length >= 8 ? null : uploadButton}
                </Upload>
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