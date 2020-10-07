import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar, Input ,Upload, Select} from 'antd';

import './BlogPage.css'
import moment from 'moment'
import Meta from 'antd/lib/card/Meta';
import UploadOutlined from '@ant-design/icons'
import { render } from 'react-dom';

const {Title} = Typography

function BlogPage_Cons_Event(props) {

    const [Contests, setContests] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Banner, setBanner] = useState("")
    const [EventImg, setEventImg] = useState("")
    const [ImgPreview, setImgPreview] = useState("")
    const [RestDay, setRestDay] = useState(7)
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)

    const [OpenModal, setOpenModal] = useState(false)
    const [EventTitle, setEventTitle] = useState("")
    const [EventDesc, setEventDesc] = useState("")

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(2)

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                if(response.data.user.job === 1)
                    props.history.push(`/${designer}`)
                setDesigner(response.data.user)
                getPosts(response.data.user.id)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if(IsBottom && LoadMore){
            getPosts()
        }
    }, [IsBottom])

    const handleScroll = () => {
        const scrollTop= (document.documentElement 
            && document.documentElement.scrollTop)
            || document.body.scrollTop
        const scrollHeight= (document.documentElement 
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;
        if(scrollTop + window.innerHeight >= scrollHeight){
            setIsBottom(true)
        }
    }

    const getPosts = (id) => {
        axios.post(`/api/info/getContests/?limit=${Limit}&offset=${Skip}`, {user : id})
        .then(response => {
            if(response.data.success){
                if(response.data.contests.length < Limit)
                    setLoadMore(false)
                if(Skip !==0){
                    setContests([...Contests, ...response.data.contests])
                }else{
                    setContests(response.data.contests)
                }
                setSkip(Skip+Limit)
            }else{
                alert('대표작품 가져오기 실패')
            }
        })
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    const renderContest = (contest) => {
        return (
            <div className="prod-works">
                <a href={`/contest/${contest.id}`}>
                <div className="contest-item-wrapper">
                    <div className="contest-item-title">
                        <p>{contest.title}</p>
                    </div>
                    <div className="contest-item-img">
                        <img  src={`http://localhost:8000${contest.image}`}/>
                    </div>
                </div>
                </a>
            </div>
            )
    }

    const EventImgChange = async ({file}) => {
        if(!file.preview){
            file.preview = await getBase64(file.originFileObj)
        }
        setEventImg(file.originFileObj)
        setImgPreview(file.preview)
    }

    const EventBannerChange = ({file}) => {
        setBanner(file.originFileObj)
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
        
        const formData = new FormData();
        formData.append('user', props.user.userData._id)
        formData.append('title', EventTitle)
        formData.append('description', EventDesc)
        formData.append('banner', Banner)
        formData.append('image', EventImg)
        formData.append('contest_expire', moment.utc(moment().format('YYYY-MM-DD') + "T11:59:59Z").add(RestDay, 'd').format())

        axios.post('/api/contest/uploadContest', formData)
        .then(response => {
            if(response.data.success){
                alert('성공')
            }else{
                alert('실패')
            }
        })
        setEventTitle("")
        setEventDesc("")
        setEventImg(null)
        setImgPreview(null)
        setOpenModal(false)
    }
    const OnSelectRestDay = (e) => {
        setRestDay(e)
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
                <div className="blog-header">
                    <Avatar style={{float:'left'}} size={200} src={`http://localhost:8000${Designer.profileImage}`}/>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job}/{Designer.major}</p>
                    </div>
                </div>
                <div className="blog-intro">
                    <h1>Works : {Designer.work}개</h1>
                    <h1>Likes : {Designer.like}개</h1>
                    <h1>Views : {Designer.view}개</h1>
                </div>
                <div className="blog-section">
                    <a href={`/${designer}/cons`}><button className="blog-tabs-btn">진행 중</button></a>
                    <a href={`/${designer}/cons/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">이벤트</button>
                    <div className="blog-tabs-content">
                        {Contests && Contests.map(contest => renderContest(contest))}
                        {props.user.userData && props.user.userData.nickname === designer && <div className="event-open-btn" onClick={OnOpenEvent}>
                            이벤트 개최
                        </div> }
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
                        <label style={{fontSize:'23px'}}>배너</label>
                        <br/>
                        <Upload
                            multiple={false}
                            onChange={EventBannerChange}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                        {Banner && <p>{Banner.name}</p>}
                        <br/><br/>
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
                        <label style={{fontSize:'28px'}}>개최일수</label>
                        <Select style={{width:'130px'}} defaultValue={7} Value={RestDay} onChange={OnSelectRestDay}>
                            <Select.Option value={7}>1주일(2$)</Select.Option>
                            <Select.Option value={14}>2주일(3$)</Select.Option>
                            <Select.Option value={28}>4주일(4$)</Select.Option>
                        </Select>
                        <br/><br/>
                        <Button className="event-modal-btn" danger onClick={OnCloseEvent}>취소</Button>
                        <Button style={{color:'powderBlue', borderColor:'powderBlue'}} className="event-modal-btn" onClick={OnHoldEvent}>개최</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Cons_Event;