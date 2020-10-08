import React, { useState } from 'react';

import {Form, Input, Upload, Button, TreeSelect, Radio} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'
import styles from './customstyle.css'
import moment from 'moment'
import './UploadVotePage.css'


const {TreeNode} = TreeSelect

function UploadVotePage(props) {

    //upload
    const [FileList, setFileList] = useState([])
    const [ThumbnailFile, setThumbnailFile] = useState('')
    const [ThumbnailUrl, setThumbnailUrl] = useState('')
    const [ThumbLoading, setThumbLoading] = useState(false)
    const [Category, setCategory] = useState(undefined)
    const [Sell, setSell] = useState(undefined)
    
    //other

    const OnCategoryClick = (value) =>{
        setCategory(value)
    }

    const OnSellChange = (e) => {
        setSell(e.target.value)
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
        if(!ThumbnailFile)
            return alert('썸네일을 선택해주세요')
        if(!FileList)
            return alert('디자인을 선택해주세요')
        if(!Category)
            return alert('카테고리를 선택해주세요')
        console.log(values)
        console.log(ThumbnailFile)
        console.log(FileList)
        console.log(Category)
        const restDay = parseInt(moment().endOf('week').fromNow()[3])+1
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
        formData.append('bidPrice', values.bidPrice ? parseInt(values.bidPrice) : -1)
        formData.append('sellPrice', values.sellPrice ? parseInt(values.sellPrice) : -1)
        formData.append('expire_dt', moment.utc(moment().format('YYYY-MM-DD') + "T23:59:59Z").add(restDay, 'd').format())
        formData.append('user', window.localStorage.getItem('userId'))
        axios.post('/api/post/uploadPost', formData, config)
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
                    {ThumbnailUrl ? <img src={ThumbnailUrl} style={{width:'300px', height:'400px', backgroundColor:'white'}}/> : uploadThumbButton}
                </Upload>
                {FileList && FileList.map((file, i)=>(
                    <div key={i} className="upload-block-prev">
                        <img style={{width:'300px',height:'400px', backgroundColor:'white'}} src={file.preview}/>
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
                <Form 
                    onFinish={onFinish}
                >
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
                            <label style={{fontSize:'30px'}}>카테고리</label><br/>
                            <TreeSelect
                                style={{width:'300px', marginTop:'20px'}}
                                value={Category}
                                dropdownStyle={{maxHeight:400, overflow:'auto'}}
                                placeholder="카테고리 선택"
                                onChange={OnCategoryClick}
                                treeDefaultExpandAll
                            >
                                <TreeNode selectable={false} title="의류">
                                    <TreeNode value={1} title="상의"/>
                                    <TreeNode value={2} title="하의"/>
                                    <TreeNode value={3} title="모자"/>
                                    <TreeNode value={4} title="아우터"/>
                                    <TreeNode value={5} title="속옷"/>
                                </TreeNode>
                                <TreeNode selectable={false} title="악세서리">
                                    <TreeNode value={6} title="귀걸이"/>
                                    <TreeNode value={7} title="시계"/>
                                    <TreeNode value={8} title="목걸이"/>
                                    <TreeNode value={9} title="팔찌"/>
                                    <TreeNode value={10} title="발찌"/>
                                    <TreeNode value={11} title="안경"/>
                                    <TreeNode value={12} title="반지"/>
                                </TreeNode>
                                <TreeNode selectable={false} title="신발">
                                    <TreeNode value={13} title="단화"/>
                                    <TreeNode value={14} title="스포츠"/>
                                    <TreeNode value={15} title="슬리퍼"/>
                                    <TreeNode value={16} title="샌들"/>
                                    <TreeNode value={17} title="하이힐"/>
                                </TreeNode>
                            </TreeSelect><br/><br/>
                            <label style={{fontSize:'30px'}}>판매 여부</label>
                            <Form.Item
                                style={{marginTop:'40px'}}
                                name="sell"
                                rules={[{required:true, message:'판매 여부를 결정해주세요'}]} 
                            >
                                <Radio.Group style={{width:'500px', height:'50px'}} onChange={OnSellChange}>
                                    <Radio.Button className="scope-radio-button" value={1}>수락</Radio.Button>
                                    <Radio.Button className="scope-radio-button" value={2}>거절</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {Sell && Sell === 1 && (
                                <>
                                <Form.Item
                                    label="입찰최저가"
                                    name="bidPrice"
                                    rules={[{required:true, message:'입찰죄저가를 써주시기 바랍니다'}]}    
                                >
                                <Input
    
                                    style={{width:'350px', fontSize:'20px'}}
                                    placeholder="제  목"
                                />
                                </Form.Item>
                                <Form.Item
                                    label="판매가"
                                    name="sellPrice"
                                    rules={[{required:true, message:'판매가를 써주시기 바랍니다'}]}    
                                >
                                <Input
    
                                    style={{width:'350px', fontSize:'20px'}}
                                    placeholder="제  목"
                                />
                                </Form.Item>
                                </>
                            )
                            }
                            <label style={{fontSize:'30px'}}>공개 범위</label>
                            <Form.Item
                                style={{marginTop:'40px'}}
                                name="scope"
                                rules={[{required:true, message:'공개 범위를 결정해주세요'}]} 
                            >
                                <Radio.Group style={{width:'500px', height:'50px'}} >
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