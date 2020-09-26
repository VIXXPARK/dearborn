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

    const showBiddingForm = () => {
        var Bid
        
        confirm({
            width:800,
            icon: null,
            content: 
            <div className="bid-container">
                <div className="bid-title">현재 입찰가 : &&원</div>
                <div className="bid-content"><p>희망가격 : </p><Input style={{width:'70px'}} value={Bid} onChange={(e)=>{Bid = e.currentTarget.value}}/> ,000원</div>
            </div>,
            onOk(){
                console.log(Bid)
                if(!Bid){
                    return alert('가격을 적어주세요')
                }else{
                    confirm({
                        icon:null,
                        content:
                            <div>정말로 입찰하시겠습니까?</div>,
                            onOk(){
                                console.log(Bid)
                                const variables = {
                                    postId : Repo.id,
                                    price : Bid,
                                }
                                axios.post('/api/bid/setBid', variables)
                                .then(response => {
                                    if(response.data.success){
                                        alert('성공')
                                    }else{
                                        alert('실패')
                                    }
                                })
                                Modal.destroyAll()
                            }
                    })
                }
            },
            onCancel(){

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
                const config = {
                    headers : {
                        Authorization: `Token ${getCookieValue('w_auth')}`
                    }
                }
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

    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    {Repo.images && Repo.images.map((image, i) => (
                        <div>
                            <img key={i} src={`http://localhost:5000/${image}`} style={{width:'100%'}} />
                        </div>
                    ))}
                    
                        <div>
                            <img src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} style={{width:'100%'}} />
                        </div>
                        <div>
                            <img src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} style={{width:'100%'}} />
                        </div>
                    
                    <br/><br/>
                    <CommentArea postId={postId}/>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-detail">
                    <div className="repo-title">
                        <Title>TITLE12312{/*Repo.title*/}</Title>
                    </div>
                    <div className="repo-span">
                        CONTENTCONTENTCONTENTCONTENTCONTENTCONTENT
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <div className="repo-content-detail">
                        {Repo.content}
                    </div>
                    <LikeDislike postId={postId} userId={localStorage.getItem('userId')}/>
                    <br/>
                    <div className="repo-right-button" onClick={showBiddingForm}>
                        입찰
                    </div>
                    <div className="repo-right-button" onClick={showHireForm}>
                        채용
                    </div>
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
            <div className="repo-profile">
                <div className="repo-profile-header">
                    {Writer.nickname}
                </div>
                <div className="repo-profile-content">
                    {Writer.content}
                </div>
                <br/>
                <div className="repo-profile-button">
                    <a href={`/${Writer.nickname}`}><Button>블로그로 가기</Button></a>
                </div>

            </div>
            
        </div>
    );
}

export default RepoDetailPage;