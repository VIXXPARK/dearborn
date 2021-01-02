import React, { useEffect, useState } from 'react';

import {Form, Input, Upload, Button, TreeSelect, Radio} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'
import styles from './customstyle.css'
import moment from 'moment'
import './UploadVotePage.css'
import {convertToLocal, convertToS3EP} from '../../utils/String'


const {TreeNode} = TreeSelect


function UploadModifyPage(props) {

    const postId = props.match.params.postId
    //upload
    const [FileList, setFileList] = useState([])
    const [Previews, setPreviews] = useState([])
    const [ThumbnailFile, setThumbnailFile] = useState('')
    const [ThumbnailUrl, setThumbnailUrl] = useState('')
    const [ThumbLoading, setThumbLoading] = useState(false)
    const [Category, setCategory] = useState(undefined)
    const [Scope, setScope] = useState(undefined)
    const [Title, setTitle] = useState("")
    const [Content, setContent] = useState("")
    const [GotData, setGotData] = useState(false)
    

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
    
        axios.post('/api/post/getPostDetail', {id : postId}, config)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                if(response.data.user.id !== window.localStorage.getItem('userId'))
                    props.history.push('/')
                setThumbnailUrl(convertToLocal(response.data.detailPost.thumbnail[0]))
                setPreviews(response.data.detailPost.images)
                setTitle(response.data.detailPost.title)
                setContent(response.data.detailPost.content)
                setCategory(response.data.detailPost.category)
                setScope(response.data.detailPost.scope)
                setGotData(true)
            }else {
                alert("포스트 정보 가져오기 실패")
            }
        })
    }, [])
    //other

    const OnCategoryClick = (value) =>{
        setCategory(value)
    }

    const onScopeChange = (e)=>{
        setScope(e.target.value)
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
        if(!Category)
            return alert('카테고리를 선택해주세요')
        
        let formData = new FormData()
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
    
        console.log(values)
        formData.append('title', values.title)
        formData.append('content', values.description)
        formData.append('category', Category)
        formData.append('scope', values.scope ? parseInt(values.scope): 2)
        axios.patch(`/api/post/${postId}`, formData, config)
            .then(response => {
                if(response.data.success)
                {
                    alert('성공')
                    props.history.push('/')
                }
                else{
                    console.log(response.data.err)
                }
        })

    }
    

    const handleThumbRemove = ()=> {
        setThumbnailUrl(null)
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

    console.log(Title)
    return (
        <div className="upload-container">
            <div className="upload-left-container">
                <Upload
                    disabled
                    listType="picture-card"
                    onPreview={false}
                    onRemove={handleThumbRemove}
                    onChange={handleThumbChange}
                    showUploadList={false}
                >
                    {ThumbnailUrl ? <div style={{width:'300px', height:'400px', backgroundColor:'white'}}><img src={ThumbnailUrl} style={{width:'100%', height:'100%'}}/><div style={{position:'relative', backgroundColor:'gray', height:'50px', top:-400, left:0,color:'white', opacity:'50%', fontSize:'20px', lineHeight:'50px'}}>썸 네 일</div></div> : uploadThumbButton}
                </Upload>
                {Previews && Previews.map((image, i)=>(
                    <div key={i} className="upload-block-prev">
                        <img style={{width:'300px',height:'400px', backgroundColor:'white'}} src={convertToLocal(image)}/>
                    </div>
                ))}
            </div>
            <div className="upload-right-container">
                {GotData &&
                <Form
                    initialValues={{
                        title : Title,
                        description : Content,
                        scope: Scope,
                    }}
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
                            />
                        </Form.Item>
                        <Form.Item
                            className="upload-desc-textarea"
                            name="description"
                        >
                            <Input.TextArea
                                className="upload-desc-textarea"
                                rows={5}
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
                                <TreeNode selectable={false} title="남성의류">
                                    <TreeNode value={1} title="상의"/>
                                    <TreeNode value={2} title="하의"/>
                                    <TreeNode value={3} title="아우터"/>
                                    <TreeNode value={4} title="속옷"/>
                                </TreeNode>
                                <TreeNode selectable={false} title="여성의류">
                                    <TreeNode value={5} title="상의"/>
                                    <TreeNode value={6} title="하의"/>
                                    <TreeNode value={7} title="원피스"/>
                                    <TreeNode value={8} title="아우터"/>
                                    <TreeNode value={9} title="속옷"/>
                                </TreeNode>
                                <TreeNode selectable={false} title="악세서리">
                                    <TreeNode value={10} title="귀걸이"/>
                                    <TreeNode value={11} title="시계"/>
                                    <TreeNode value={12} title="목걸이"/>
                                    <TreeNode value={13} title="팔찌"/>
                                    <TreeNode value={14} title="발찌"/>
                                    <TreeNode value={15} title="안경"/>
                                    <TreeNode value={16} title="반지"/>
                                    <TreeNode value={17} title="모자"/>
                                </TreeNode>
                                <TreeNode selectable={false} title="신발">
                                    <TreeNode value={18} title="단화"/>
                                    <TreeNode value={19} title="스포츠"/>
                                    <TreeNode value={20} title="슬리퍼"/>
                                    <TreeNode value={21} title="샌들"/>
                                    <TreeNode value={22} title="하이힐"/>
                                </TreeNode>
                            </TreeSelect><br/><br/>
                            
                            <label style={{fontSize:'30px'}}>공개 범위</label>
                            <Form.Item
                                style={{marginTop:'40px'}}
                                name="scope"
                                rules={[{required:true, message:'공개 범위를 결정해주세요'}]} 
                            >
                                <Radio.Group style={{width:'500px', height:'50px'}} onChange={onScopeChange}>
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
                </Form>}
            </div>
        </div>
    );
}

export default UploadModifyPage;