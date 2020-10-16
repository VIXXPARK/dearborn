import React, { useState, useEffect } from 'react';
import './VoteDetailPage.css'
import DetailModal from '../../utils/DetailModal'
import axios from 'axios'
import { Input, Modal} from 'antd';
import {config} from '../../utils/Token'


const {confirm} = Modal;

function VoteDetailPage(props) {

    const [DetailPost, setDetailPost] = useState('')
    const [Writer, setWriter] = useState('')
    const [OnModal, setOnModal] = useState(false)

    const params = new URLSearchParams(props.location.search)

    useEffect(() => {
        if(props.user.userData && !props.user.userData.isAuth)
            props.history.push('/login')
        if((params.get('designer') ||params.get('postId')) == null)
            return
        document.body.style.cssText = 'overflow-y : hidden;'
        axios.post('/api/post/upView', {id : params.get('postId')})
        .then(response => {
            if(!response.data.success){
                console.log(response.data)
                alert('조회수 에러')
            }
        })
        axios.post('/api/post/getPostDetail', {id : params.get('postId')})
        .then(response => {
            if(response.data.success){
                
                setOnModal(true)
                console.log(response.data)
                setDetailPost(response.data.detailPost)
                setWriter(response.data.user)
            }else{
                alert('데이터 가져오기 실패')
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
                                axios.post('/api/bid/setBid', variables, config)
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

    return (
        OnModal && params.get('designer') && (
        <DetailModal
            onClick={()=>{
                setOnModal(false)
                props.history.go(-1)
            }}
        >
            <div className="profile-content">
                <div className="detail-header">
                    {DetailPost.title}
                </div>
                <div className="detail-span">
                    {DetailPost.updatedAt}
                </div>
                {DetailPost.content}
                <div className="vote-btn">
                    투표하기
                </div>
                {props.user.userData && props.user.userData.job === 1 && 
                    <div className="vote-btn" onClick={showBiddingForm}>
                        입찰하기
                    </div>
                }
                <div className="profile-header">
                    {Writer.nickname}
                </div>
                <img style={{width:'200px', height:'200px', borderRadius:'100px', marginBottom:'30px'}} src={`http://localhost:8000${Writer.profileImage}`}/>
            </div>
            <div style={{color:'black'}}>
                <div className="detail-content">
                    {DetailPost.images && DetailPost.images.map((image, i) => (
                        <div>
                            <img key={i} src={`http://localhost:8000${image}`} style={{width:'100%'}} />
                        </div>
                    ))}
                </div>
            </div>
        </DetailModal>
        )
    );
}

export default VoteDetailPage;