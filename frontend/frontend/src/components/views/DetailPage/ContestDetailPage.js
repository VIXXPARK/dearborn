import React, { useEffect, useState } from 'react';
import {Button, Input, Typography, Upload} from 'antd'
import axios from 'axios';
import {UploadOutlined} from '@ant-design/icons'

const {Title} = Typography

function ContestDetailPage(props) {

    const [Host, setHost] = useState("")
    const [Contest, setContest] = useState("")
    const [OpenModal, setOpenModal] = useState(false)
    const [EventImgs, setEventImgs] = useState([])
    const [ImgPreview, setImgPreview] = useState([])
    const [EventThumbnailImg, setEventThumbnailImg] = useState("")
    const [ThumbnailPreview, setThumbnailPreview] = useState("")

    const contestId = props.match.params.contestId

    useEffect(() => {
        axios.post('/api/contest/getContest', {id: contestId})
        .then(response => {
            if(response.data.success){
                setContest(response.data.contest)
                setHost(response.data.host)
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

    const EventImgChange = async ({file}) => {
        if(!file.preview){
            console.log(1)
            file.preview = await getBase64(file.originFileObj)
            setEventImgs([...EventImgs, file.originFileObj])
            setImgPreview([...ImgPreview, file.preview])
        }
    }
    console.log(ImgPreview)
    const EventThumbnailImgChange = async ({file}) => {
        if(!file.preview){
            console.log(1)
            file.preview = await getBase64(file.originFileObj)
            setEventThumbnailImg(file.originFileObj)
            setThumbnailPreview(file.preview)
        }
    }

    const OpenUploadForm = () => {
        setOpenModal(true)
    }

    const OnCloseEvent = () => {
        setOpenModal(false)
    }

    const OnSubmitContest = () => {
        const formData = new FormData()
        EventImgs.forEach(file => formData.append('images', file))
        formData.append('thumbnail', EventThumbnailImg)
        axios.post('/api/contest/post/uploadContest', formData)
        .then(response => {
            if(response.data.success){
                alert('성공')
            }else{
                alert('실패')
            }
        })
    }
    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    <div style={{border:'1px solid black', borderRadius:'20px'}}>
                        <br/><br/>
                        <div style={{borderBottom:'1px solid black'}}>
                            <Title>{Contest.title}</Title>
                        </div>
                        <img src={`http://localhost:8000${Contest.image}`} style={{width:'100%'}} />
                        <p style={{marginTop:'50px', textAlign:'left'}}>{Contest.description}</p>
                    </div>
                    <br/><br/>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-detail">
                    <div className="repo-title">
                        <Title>개최자 정보</Title>
                    </div>
                    <div className="repo-span">
                        {Host.nickname}
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <div className="repo-span">
                        {Host.content}
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <a href={`/${Host.nickname}/cons`}><div className="event-right-button">
                        블로그 가기
                    </div></a>
                    <br/>
                </div>
                <div className="event-bid-button" onClick={OpenUploadForm}>
                    공모전 참여하기
                </div>
            </div>
            <div id={OpenModal ? "open-modal" : "close-modal"}>
                <div className="event-modal-background"></div>
                <div className="event-modal-container">
                    <div className="event-modal-wrapper">
                        <Title>이벤트 참여하기</Title>
                        <div className="modal-body">
                            <div className="modal-body-section">
                                <label style={{fontSize:'23px'}}>썸네일</label>
                                <br/><br/>
                                <Upload
                                    multiple
                                    onChange={EventThumbnailImgChange}
                                    showUploadList={false}
                                >
                                    <div style={{width:'200px', height:'300px', border:'1px solid black', borderRadius:'20px'}}>{
                                    ThumbnailPreview ? <img style={{width:'100%', height:'100%',borderRadius:'20px', cursor:'pointer'}} src={ThumbnailPreview}/> 
                                    : 
                                    <div style={{textAlign:'center', marginTop:'135px'}}><Button icon={<UploadOutlined/>}>Upload</Button></div>
                                    }</div>
                                </Upload>
                            </div>
                            <div className="modal-body-section">
                                <label style={{fontSize:'23px'}}>이미지 첨부하기</label>
                                <br/><br/>
                                <Upload
                                    multiple
                                    onChange={EventImgChange}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined/>}>Upload</Button>
                                </Upload>
                                <div className="event-img-box">
                                {ImgPreview && ImgPreview.map(preview => (
                                    <div style={{width:'100px', height:'150px', float:'left', margin:'10px'}}>
                                        <img style={{width:'100%', height:'100%',borderRadius:'10px'}} src={preview}/>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                        <br/><br/>
                        <Button className="event-modal-btn" danger onClick={OnCloseEvent}>취소</Button>
                        <Button style={{color:'powderBlue', borderColor:'powderBlue'}} className="event-modal-btn" onClick={OnSubmitContest}>제출</Button>
                    </div>
                </div>
            </div>      
        </div>
    );
}

export default ContestDetailPage;