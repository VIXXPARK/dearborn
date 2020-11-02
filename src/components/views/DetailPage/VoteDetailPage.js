import React, { useState, useEffect } from 'react';
import './VoteDetailPage.css'
import DetailModal from '../../utils/DetailModal'
import axios from 'axios'
import { Input, Modal} from 'antd';
import {config} from '../../utils/Token'
import {convertToS3EP} from '../../utils/String'
import {FormOutlined, DollarOutlined, DeleteOutlined} from '@ant-design/icons'
import {getCookieValue} from '../../utils/Cookie'

const {confirm} = Modal;

function VoteDetailPage(props) {

    const [DetailPost, setDetailPost] = useState('')
    const [Writer, setWriter] = useState('')
    const [OnModal, setOnModal] = useState(false)
    const [Voted, setVoted] = useState(false)
    const [VoteLength, setVoteLength] = useState(0)

    const params = new URLSearchParams(props.location.search)
    useEffect(() => {
        if(props.user.userData && !props.user.userData.isAuth)
            props.history.push('/login')
        if((params.get('designer') ||params.get('postId')) == null)
            return
        document.body.style.cssText = 'overflow-y : hidden;'
        
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/post/upView', {id : params.get('postId')}, config)
        .then(response => {
            if(!response.data.success){
                console.log(response.data.err)
            }
        })
        if(window.localStorage.getItem('userId')){
            axios.post('/api/vote/myVote', {user : window.localStorage.getItem('userId')}, config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    if(response.data.posts.indexOf(params.get('postId')) !== -1)
                        setVoted(true)
                    setVoteLength(response.data.posts.length)
                }else{
                    console.log(response.data.err)
                }
            })}
            
        axios.post('/api/post/getPostDetail', {id : params.get('postId')}, config)
        .then(response => {
            if(response.data.success){
                
                setOnModal(true)
                console.log(response.data)
                setDetailPost(response.data.detailPost)
                setWriter(response.data.user)
            }else{
                console.log(response.data.err)
            }
        })
        return ()=>{
            document.body.style.cssText = 'overflow-y : scroll;'
        }
    }, [params.get('postId')])
    
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
                                    user : props.user.userData._id,
                                    post : DetailPost.id,
                                    price : Bid,
                                }
                                const config = {
                                    headers : {
                                        Authorization: `Token ${getCookieValue('w_auth')}`
                                    }
                                }
                                axios.post('/api/bid/setBid', variables, config)
                                .then(response => {
                                    console.log(response)
                                    if(response.data.success){
                                        alert('성공')
                                    }else{
                                        alert('실패')
                                        console.log(response.data.err)
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

    const OnDeleteClick = () => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
            }
        axios.post('/api/post/delete', {id : DetailPost.id}, config)
        .then(response => {
            if(response.status ===200){
                console.log(response.data)
                alert('삭제 성공')
                props.history.push('/')
            }else{
                alert('실패')
                console.log(response)
            }
        })
    }

    const OnVoteClick = () => {
        if(VoteLength === 3)
            return alert('이미 3번의 투표지를 사용했습니다.')
        
        const config = {
        headers : {
            Authorization: `Token ${getCookieValue('w_auth')}`
        }
        }
        axios.post('/api/vote/upVote', {user: props.user.userData._id, post: DetailPost.id}, config)
        .then(response => {
            if(response.data.success){
                setVoted(true)
            }else{
                console.log(response.data.err)
            }
        })
    }
    
    return (
        OnModal && params.get('designer') && (
        <DetailModal
            onClick={()=>{
                setOnModal(false)
                props.history.go(-1)
                setDetailPost('')
                setWriter('')
                setVoted(false)
            }}
        >
            <div className="profile-content">
                <div className="profile-icon" onClick={()=>props.history.push(`/${Writer.nickname}`)}>
                    <img style={{width:'50px', height:'50px', borderRadius:'100px'}} src={Writer && Writer.profileImage[0] ? convertToS3EP(Writer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                </div>
                <div className="profile-header">
                    {Writer.nickname}
                </div>
                <div className="profile-icon" onClick={OnVoteClick}>
                    <FormOutlined/>
                </div>
                <div className="profile-header">
                    {Voted ? "투표함" : "투표하기"}
                </div>
                {props.user.userData && props.user.userData.job === 2 && 
                <>
                    <div className="profile-icon" onClick={showBiddingForm}>
                        <DollarOutlined/>
                    </div>
                    <div className="profile-header">
                        입찰하기
                    </div>
                </>
                }
                {props.user.userData && Writer && props.user.userData._id === Writer.id && 
                <>
                    <div className="profile-icon" onClick={OnDeleteClick}>
                        <DeleteOutlined/>
                    </div>
                    <div className="profile-header">
                        삭제하기
                    </div>
                </>
                }
            </div>
            <div style={{color:'black'}}>
                <div className="detail-content">
                    {DetailPost.images && DetailPost.images.map((image, i) => (
                        <div>
                            <img key={i} src={convertToS3EP(image)} style={{width:'100%'}} />
                        </div>
                    ))}
                </div>
                {DetailPost.content}
            </div>
        </DetailModal>
        )
    );
}

export default VoteDetailPage;