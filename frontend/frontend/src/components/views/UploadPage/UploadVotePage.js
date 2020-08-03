import React, { useState } from 'react';

import {Form, Input, Upload} from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import usePromise from '../../utils/usePromise'
import { resolve } from 'path';
import { rejects } from 'assert';
import Modal from 'antd/lib/modal/Modal';

import {PRODUCT_SERVER} from '../../Config'

const {TextArea} = Input


function UploadVotePage(props) {

    const [PreviewVisible, setPreviewVisible] = useState(false)
    const [PreviewImage, setPreviewImage] = useState('')
    const [FileList, setFileList] = useState([])
    const [PreviewTitle, setPreviewTitle] = useState('')

    const getBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => rejects(error)
    }

    const onFinish = (values) => {
        console.log(values)
    }

    const handlePreview = (file) => {
        if(!file.url && !file.preview){
            file.preview = getBase64(file.originFileObj)
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

    return (
        <div style={{}}>
            <Form onFinish={onFinish}>
                <Form.Item name="title">
                    <Input placeholder="제  목"/>
                </Form.Item>
                <Upload
                    action={`${PRODUCT_SERVER}/uploadImagesInArticle`}
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
                <TextArea
                    
                >
                </TextArea>
            </Form>
            
        </div>
    );
}

export default UploadVotePage;