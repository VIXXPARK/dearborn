import React, { useEffect, useState } from 'react';
import {Button, Input, Typography, Upload} from 'antd'
import axios from 'axios';
import {UploadOutlined} from '@ant-design/icons'

const {Title} = Typography

function ContestDetailPage(props) {

    const [Host, setHost] = useState(null)
    const [Contest, setContest] = useState(null)
    const [OpenModal, setOpenModal] = useState(false)
    const [EventImg, setEventImg] = useState([])
    const [ImgPreview, setImgPreview] = useState([])

    const contestId = props.match.params.contestId

    useEffect(() => {
        axios.post('/api/contest/getHost', {id : contestId})
        .then(response => {
            if(response.data.success){
                setHost(response.data.host)
            }
        })
        axios.post('/api/contest/getContest', {id: contestId})
        .then(response => {
            if(response.data.success){
                setContest(response.data.contest)
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
            file.preview = await getBase64(file.originFileObj)
        }
        setEventImg(file.originFileObj)
        setImgPreview(file.preview)
    }

    const OpenUploadForm = () => {
        setOpenModal(true)
    }

    const OnCloseEvent = () => {
        setOpenModal(false)
    }

    const OnSubmitContest = () => {
        const variables = {

        }
    }

    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    <div style={{border:'1px solid black', borderRadius:'20px'}}>
                        <br/><br/>
                        <div style={{borderBottom:'1px solid black'}}>
                            <Title>Title</Title>
                        </div>
                        <img src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} style={{width:'100%'}} />
                        <p style={{marginTop:'50px', textAlign:'left'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id nibh tristique, blandit lorem et, aliquet nunc. Curabitur venenatis porttitor lorem sit amet fringilla. Sed at maximus ipsum, vitae volutpat lacus. Fusce nec risus semper, ultrices libero nec, bibendum tortor. Phasellus non diam non nisi semper lobortis ut vitae tortor. Nunc vitae lacus sit amet nisi malesuada dictum sit amet sed nunc. Aliquam ac viverra dolor, nec consectetur tortor. Mauris augue urna, euismod ut arcu vitae, mattis bibendum purus. Nunc eu est a lorem accumsan fermentum nec et arcu.

Morbi quis ornare diam. Mauris fringilla, libero vel efficitur eleifend, sem diam finibus augue, id rhoncus odio odio at neque. Vestibulum vestibulum sodales vehicula. Duis nunc velit, condimentum sed ipsum in, ultricies aliquam libero. Nulla a facilisis leo, vitae malesuada enim. Nullam eu sapien ut sem auctor condimentum. Quisque aliquam elit ligula, ac dapibus ex imperdiet lobortis. Pellentesque ut ligula quis nulla blandit dignissim sit amet vulputate ligula. Integer turpis arcu, fringilla eu cursus placerat, vehicula ac diam. Donec a congue augue. Sed quis mattis ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas malesuada erat in orci venenatis, interdum cursus nunc faucibus. Phasellus vel vulputate turpis.</p>
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
                        Host.nickname
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <div className="repo-span">
                        Host.content
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <a href={`/Host.nickname/cons`}><div className="event-right-button">
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
                        <Title>이벤트 개최하기</Title>
                        <label style={{fontSize:'23px'}}>이미지</label>
                        <br/>
                        <Upload
                            multiple={true}
                            onChange={EventImgChange}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                        {ImgPreview && ImgPreview.map(preview => (
                            <img style={{width:'50px', height:'75px'}} src={preview}/>
                        ))}
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