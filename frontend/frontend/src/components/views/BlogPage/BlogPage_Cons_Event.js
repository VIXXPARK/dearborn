import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar, Input ,Upload} from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';
import UploadOutlined from '@ant-design/icons'

const {Title} = Typography

function BlogPage_Cons_Event(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")
    const [EventImg, setEventImg] = useState("")
    const [ImgPreview, setImgPreview] = useState("")

    const [OpenModal, setOpenModal] = useState(false)
    const [EventTitle, setEventTitle] = useState("")
    const [EventDesc, setEventDesc] = useState("")

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/post/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                setRepos(response.data.repos)
                setDesigner(response.data.user)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    const renderPost = (repo) => {
        return (
            <Card
                className="item"
                cover={<a href={`/${Designer.nickname}/${repo.id}`}><img src={`http://localhost:8000${repo.images[0]}`} alt/></a>}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={repo.title}
                    description={repo.content}
                />
            </Card>
            )
    }

    const EventImgChange = async ({file}) => {
        if(!file.preview){
            file.preview = await getBase64(file.originFileObj)
        }
        setEventImg(file.originFileObj)
        setImgPreview(file.preview)
    }

    const OnOpenEvent = () => {
        setOpenModal(true)
    }

    const OnCloseEvent = () =>{
        setEventTitle("")
        setEventDesc("")
        setEventImg(null)
        setImgPreview(null)
        setOpenModal(false)
    }

    const onEventTitleChange = (e) =>{
        setEventTitle(e.currentTarget.value)
    }

    const onEventDescChange = (e) =>{
        setEventDesc(e.currentTarget.value)
    }

    const OnHoldEvent= () =>{
        const variable = {
            title : EventTitle,
            description : EventDesc,
            image : EventImg
        }

        console.log(variable)
        setEventTitle("")
        setEventDesc("")
        setEventImg(null)
        setImgPreview(null)
        setOpenModal(false)
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
                <div className="blog-header">
                    <Avatar style={{float:'left'}} size={200} src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">Content</p>
                        <p id="blog-header-p2">job/major</p>
                    </div>
                </div>
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <a href={`/${Designer.nickname}/cons`}><button className="blog-tabs-btn">진행 중</button></a>
                    <a href={`/${Designer.nickname}/cons/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">이벤트</button>
                    <div className="blog-tabs-content">
                        <div className="prod-works">
                            <div className="works-wrapper">
                                <img className="works-thumb" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                                <div className="works-content">
                                    <p>Title</p>
                                    <p>Content</p>
                                </div>
                            </div>
                        </div>
                        <div className="event-open-btn" onClick={OnOpenEvent}>
                            이벤트 개최
                        </div>  
                    </div>
                </div>
            </div>
            <div id={OpenModal ? "open-modal" : "close-modal"}>
                <div className="event-modal-background"></div>
                <div className="event-modal-container">
                    <div className="event-modal-wrapper">
                        <Title>이벤트 개최하기</Title>
                        <label style={{fontSize:'28px'}}>제목</label>
                        <Input value={EventTitle} onChange={onEventTitleChange}/>
                        <br/><br/><br/>
                        <label style={{fontSize:'25px'}}>설명</label>
                        <Input.TextArea rows={10} value={EventDesc} onChange={onEventDescChange}/>
                        <br/><br/><br/>
                        <label style={{fontSize:'23px'}}>포스터</label>
                        <br/>
                        <Upload
                            multiple={false}
                            onChange={EventImgChange}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                        {ImgPreview ? <img style={{width:'50px', height:'50px'}} src={ImgPreview}/>:null}
                        <br/><br/>
                        <Button className="event-modal-btn" danger onClick={OnCloseEvent}>취소</Button>
                        <Button style={{color:'powderBlue', borderColor:'powderBlue'}} className="event-modal-btn" onClick={OnHoldEvent}>개최</Button>
                    </div>
                </div>
            </div>
            <div className="blog-left-intro">
                <h1>입찰 진행중 : {}개</h1>
                <h1>입찰 완료 : {}개</h1>
                <h1>이벤트 개최중 : {}개</h1>
            </div>
        </div>
    );
}

export default BlogPage_Cons_Event;