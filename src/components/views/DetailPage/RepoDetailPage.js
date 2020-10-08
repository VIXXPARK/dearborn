import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography, Button, Modal, Input} from 'antd'

import LikeDislike from './Sections/LikeDislike'
import CommentArea from './Sections/CommentArea'
import AssessArea from './Sections/AssessArea';

import './RepoDetailPage.css'
import AssessShow from './Sections/AssessShow';
import {ContainerOutlined} from '@ant-design/icons'
import {getCookieValue} from '../../utils/Cookie'
import {config} from '../../utils/Token'


const {Title} = Typography
const {confirm} = Modal

function RepoDetailPage(props) {

    const [Writer, setWriter] = useState("")
    const [Repo, setRepo] = useState("")
    const [AssessValue, setAssessValue] = useState([])
    const postId = props.match.params.postId
    useEffect(() => {
        axios.post('/api/post/getPostDetail', {id : postId})
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setRepo(response.data.detailPost)
                setWriter(response.data.user)
            }else{
                alert('데이터 가져오기 실패')
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
            </div>,
            okText: "구매",
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
                <div className="hire-title">시간당 $$$ won을 희망하고 있습니다.</div>
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
                        alert('실패')
                    }
                })
            }
        })
    }

    const onModifyClick = () => {

    }

    const onDeleteClick = () => {
        
    }

    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    {Repo.images && Repo.images.map((image, i) => (
                        <div className="repo-content-img">
                            <img key={i} src={`http://localhost:8000${image}`} style={{width:'100%', height:'100%'}} />
                        </div>
                    ))}
                    <br/><br/>
                    <CommentArea postId={postId}/>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-detail">
                    <div className="repo-title">
                        {props.user.userData && props.user.userData._id === Writer.id &&
                        <div className="repo-title-btn-wrapper">
                            <button className="repo-detail-btn" onClick={onModifyClick}>수정</button>
                            <button className="repo-detail-btn" onClick={onDeleteClick}>삭제</button>
                        </div>}
                        <Title>TITLE12312{/*Repo.title*/}</Title>
                        <div className="repo-profile">
                            <img style={{width:'30px', height:'30px',borderRadius:'50px', display:'inline-block'}} src={`http://localhost:8000${Writer.profileImage}`}/>
                            <div className="repo-profile-header">
                                <a href={`/${Writer.nickname}`}>{Writer.nickname}</a>
                            </div>
                        </div>
                    </div>
                    <div className="repo-span">
                        {Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""}
                    </div>
                    <div className="repo-content-detail">
                        {Repo.content}
                    </div>
                    <LikeDislike postId={postId} userId={localStorage.getItem('userId')}/>
                    <br/>
                    {props.user.userData && props.user.userData.job === 2 &&
                    <>
                    <label>원하는 가격 : {10000}원</label>
                    <div className="repo-right-button" onClick={showPurchaseForm}>
                        판매
                    </div>
                    <div className="repo-right-button" onClick={showHireForm}>
                        채용
                    </div>
                    </>
                    }
                </div>
                <div className="repo-assess">
                    <AssessShow assessValue={AssessValue} postId={postId}/>
                </div>
                <div className="repo-assess-area">
                    <AssessArea postId={postId} userId={localStorage.getItem('userId')}
                        updateAssessValue={updateAssess}/>
                </div>
                <br/>
            </div>
            
        </div>
    );
}

export default RepoDetailPage;