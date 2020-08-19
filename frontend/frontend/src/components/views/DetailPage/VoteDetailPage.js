import React, { useState, useEffect } from 'react';
import './VoteDetailPage.css'
import Modal from '../../utils/Modal'
import axios from 'axios'

function VoteDetailPage(props) {

    const [DetailPost, setDetailPost] = useState('')
    const [Writer, setWriter] = useState('')
    const [OnModal, setOnModal] = useState(false)

    const params = new URLSearchParams(props.location.search)

    useEffect(() => {
        if((params.get('designer') ||params.get('postId')) == null)
            return
        document.body.style.cssText = 'overflow-y : hidden;'
        axios.post('/api/post/upView', {postId : params.get('postId')})
        .then(response => {
            if(!response.data.success){
                alert('조회수 에러')
            }
        })
        axios.post('/api/post/getPostDetail', {postId : params.get('postId')})
        .then(response => {
            if(response.data.success){
                
                setOnModal(true)
                setDetailPost(response.data.detailPost[0])
                setWriter(response.data.detailPost[0].writer)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
        return ()=>{
            document.body.style.cssText = 'overflow-y : scroll;'
        }
    }, [params.get('postId')])
    

    return (
        OnModal && params.get('designer') && (
        <Modal
            onClick={()=>{
                setOnModal(false)
                props.history.go(-1)
            }}
        >
            <div className="profile-content">
                <div className="profile-header">
                    {Writer.nickname}
                </div>
                <div className="profile-span">
                    {Writer.content}
                    sfjlskdfjlkdsfjldsjfldsjldsjflkfsdjdlfksjs
                </div>
            </div>
            <div style={{color:'black'}}>
                <div className="detail-header">
                    {DetailPost.title}
                </div>
                <div className="detail-span">
                    {DetailPost.updatedAt}
                </div>
                <div className="detail-content">
                    {DetailPost.images && DetailPost.images.map((image, i) => (
                        <div>
                            <img key={i} src={`http://localhost:5000/${image}`} style={{width:'100%'}} />
                        </div>
                    ))}
                    {DetailPost.content}
                </div>
            </div>
        </Modal>
        )
    );
}

export default VoteDetailPage;