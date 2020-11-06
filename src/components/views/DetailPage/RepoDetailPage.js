import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography, Button, Modal, Input} from 'antd'

import LikeDislike from './Sections/LikeDislike'
import CommentArea from './Sections/CommentArea'
import AssessArea from './Sections/AssessArea';

import './RepoDetailPage.css'
import AssessShow from './Sections/AssessShow';
import {EditOutlined, DeleteOutlined, FileTextOutlined, DollarOutlined} from '@ant-design/icons'
import {getCookieValue} from '../../utils/Cookie'
import {config} from '../../utils/Token'
import {convertToS3EP} from '../../utils/String'
import PostRankBox from '../LandingPage/Sections/PostRankBox';
import { PayPalButton } from 'react-paypal-button-v2';


const {Title} = Typography
const {confirm} = Modal

function RepoDetailPage(props) {

    const [Writer, setWriter] = useState("")
    const [Repo, setRepo] = useState("")
    const [AssessValue, setAssessValue] = useState([])
    const [AssessWindow, setAssessWindow] = useState(false)
    const postId = props.match.params.postId
    console.log(Repo)
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
                setRepo(response.data.detailPost)
                setWriter(response.data.user)
            }else{
                console.log(response.data.err)
            }
        })
    }, [])

    const updateAssess = (value) => {
        setAssessValue(value)
    }

    const showPurchaseForm = () => {
        var purchasePrice
        confirm({
            width:800,
            icon:null,
            content: 
            <div className="bid-container">
                정말로 구매하시겠습니까?
                <PayPalButton
                    amount={0}
                    currency={'USD'}
                    onSuccess={()=>console.log("구매")}
                />
            </div>,
            okText: "확인",
            cancelText: "취소",
            onOk(){
                console.log("구매")
            }
        })
    }

    const showHireForm = () => {
        var HireMessage
        confirm({
            width:800,
            icon:null,
            content: 
            <div className="bid-container">
                <div className="hire-content">메시지<br/><Input.TextArea style={{fontSize:'20px'}} rows={5}  onChange={(e)=>{HireMessage = e.currentTarget.value}}/></div>
            </div>,
            okText: "메시지 전송",
            cancelText: "취소",
            onOk(){
                const variables = {
                    message : HireMessage,
                    userFrom : props.user.userData._id,
                    userTo : Writer.id,
                }
                console.log(Writer)
                console.log(variables)
                axios.post('/api/message/saveMessage', variables, config)
                .then(response => {
                    if(response.data.success){
                        alert('성공')
                    }else{
                        console.log(response.data.err)
                    }
                })
            }
        })
    }

    const onModifyClick = () => {
        props.history.push(`/upload/modify/${postId}`)
    }

    const onDeleteClick = () => {
        axios.post(`/api/post/delete`, {id:postId})
        .then(response => {
            if(response.status === 200){
                console.log(response.data)
                alert('삭제 성공')
                props.history.push('/')
            }else{
                console.log(response.data.err)
            }
        })
    }

    const AssessWindowOpen = () => {
        setAssessWindow(true)
    }

    const AssessWindowClose = ()=>{
        setAssessWindow(false)
    }

    return (
        <div style={{width:'100vw', height:'100%', backgroundColor:'#F9F8FD'}}>
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    {props.user.userData && props.user.userData._id === Writer.id &&
                        <div className="repo-title-btn-wrapper">
                            <button className="repo-detail-btn" onClick={onModifyClick}>수정</button>
                            <button className="repo-detail-btn" onClick={onDeleteClick}>삭제</button>
                        </div>}
                    {Repo.images && Repo.images.map((image, i) => (
                        <div className="repo-content-img">
                            <img key={i} src={convertToS3EP(image)} style={{width:'100%', height:'100%'}} />
                        </div>
                    ))}
                    <div className="repo-content-detail">
                        {Repo.content}
                    </div>
                    <br/><br/>
                    {Writer && props.user.userData && Writer.id !== props.user.userData._id &&<LikeDislike postId={postId} userId={localStorage.getItem('userId')}/>}
                    <br/><br/>
                    <CommentArea postId={postId}/>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-icon">
                    <div className="profile-icon" onClick={()=>props.history.push(`/${Writer.nickname}`)}>
                        <img style={{width:'50px', height:'50px', borderRadius:'100px'}} src={Writer && Writer.profileImage[0] ? convertToS3EP(Writer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        {Writer.nickname}
                    </div>
                    
                    {Writer && props.user.userData && Writer.id !== props.user.userData._id && <LikeDislike icon postId={postId} userId={localStorage.getItem('userId')}/>}
                    {props.user.userData && props.user.userData._id === Writer.id && <>
                    <div style={{border:'1px solid rgb(229, 229, 229)'}} className="profile-icon" onClick={onModifyClick}>
                        <EditOutlined />
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        수정
                    </div>
                    <div style={{border:'1px solid rgb(229, 229, 229)'}} className="profile-icon" onClick={onDeleteClick}>
                        <DeleteOutlined />
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        삭제
                    </div></>}
                    {props.user.userData && props.user.userData.job === 2 && 
                    <>
                    {Repo && Repo.sell === 1 &&
                    <>
                    <div style={{border:'1px solid rgb(229, 229, 229)'}} className="profile-icon" onClick={showPurchaseForm}>
                        <DollarOutlined />
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        {`판매 ( ${Repo.sellPrice}원)`}
                    </div>
                    </>}
                    <>
                    <div style={{border:'1px solid rgb(229, 229, 229)'}} className="profile-icon" onClick={showHireForm}>
                        <FileTextOutlined />
                    </div>
                    <div className="profile-header" style={{color:'black'}}>
                        채용
                    </div>
                    </>
                    </>
                    }
                </div>
                <div className="repo-assess-wrapper" id={AssessWindow ? null : "repo-assess-show"}>
                    <div style={{textAlign:'right', marginTop:'20px',marginRight:'20px', fontSize:'30px', cursor:'pointer'}} onClick={AssessWindowClose}>X</div>
                    <div className="repo-assess">
                        <AssessShow assessValue={AssessValue} postId={postId}/>
                    </div>
                    <div className="repo-assess-area">
                        <AssessArea postId={postId} userId={localStorage.getItem('userId')}
                            updateAssessValue={updateAssess}/>
                    </div>
                </div>
                <div className="repo-assess-icon" id={AssessWindow ? null:"repo-icon-show"} onClick={AssessWindowOpen}>
                    평 가
                </div>
                <br/>
            </div>
            
        </div>
        </div>
    );
}
export default RepoDetailPage;