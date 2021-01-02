import React, { useEffect, useState } from 'react';
import {Button, Input, Typography, Upload} from 'antd'
import axios from 'axios';
import {UploadOutlined} from '@ant-design/icons'
import {convertToLocal, convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'

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
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/contest/getContest', {id: contestId}, config)
        .then(response => {
            console.log(response)
            if(response.data.success){
                setContest(response.data.contest)
                setHost(response.data.host)
            }else{
                console.log(response.data.err)
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
        formData.append('user', props.user.userData._id)

        axios.post('/api/contest/post/uploadContest', formData)
        .then(response => {
            if(response.data.success){
                alert('성공')
            }else{
                console.log(response.data.err)
            }
        })
    }
    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    <div style={{borderRadius:'20px'}}>
                        <img src={convertToLocal(Contest.image)} style={{width:'100%', borderRadius:'20px'}} />
                    </div>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-icon">
                    <div className="profile-icon" onClick={()=>props.history.push(`/${Host.nickname}`)}>
                        <img style={{width:'50px', height:'50px', borderRadius:'100px'}} src={Host && Host.profileImage ? convertToLocal(Host.profileImage) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        {Host.nickname}
                    </div>
                    <div style={{textAlign:'left'}}>
                        {Contest.description}
                    </div>
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