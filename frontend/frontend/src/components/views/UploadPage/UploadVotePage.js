import React, { useState } from 'react';

import {Form, Input, Upload, Button} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'

import Modal from 'antd/lib/modal/Modal';

import {PRODUCT_SERVER} from '../../Config'

const {TextArea} = Input


function UploadVotePage(props) {
    //upload
    const [PreviewVisible, setPreviewVisible] = useState(false)
    const [PreviewImage, setPreviewImage] = useState('')
    const [FileList, setFileList] = useState([])
    const [PreviewTitle, setPreviewTitle] = useState('')
    
    //other
    const [Title, setTitle] = useState("")
    const [Content, setContent] = useState("")

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
            header : {'content-type' : 'multipart/form-data'}
        }
        FileList.forEach(file => formData.append('files', file.originFileObj))

        axios.post('/api/product/uploadImage', formData, config)
        .then(response => {
            console.log(response.data)
        })

        const variable = {
            values:values,
            fileList : FileList,
        }
        console.log(variable)

    }

    const handlePreview = async (file) => {
        if(!file.url && !file.preview){
            file.preview = await getBase64(file.originFileObj)
        }else{
            return alert('파일 오류')
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')+1))
    }

    const handleChange = ({fileList}) => {
        setFileList(fileList)
        console.log('2')
        console.log(FileList)
    }

    const handleCancel = () => setPreviewVisible(false)

    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    //other

    const onTitleChange = (e) =>{
        setTitle(e.currentTarget.value)
    }

    const onContentChange = (e) => {
        setContent(e.currentTarget.value)
    }

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