import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';

import './LikeDislike.css'
function LikeDislike(props) {

    const [Likes, setLikes] = useState(0)
    const [Liked, setLiked] = useState(false)
    const [Disliked, setDisliked] = useState(false)

    useEffect(() => {
        axios.post('/api/like/getLikes', {postId : props.postId})
        .then(response => {
            if(response.data.success){
                console.log(response.data.likes)
                setLikes(response.data.likes.length)
                response.data.likes.map(like => {
                    if(like.userId === props.userId){
                        setLiked(true)
                    }
                })
            }else{
                alert('좋아요 가져오기 실패')
            }
        })

        axios.post('/api/like/getDisliked', {postId : props.postId, userId : props.userId})
        .then(response => {
            console.log(response.data.dislike)
            if(response.data.success){
                if(response.data.dislike.length !== 0)
                    setDisliked(true)
            }else{
                alert('싫어요 가져오기 실패')
            }
        })
    }, [])

    const LikeClickHandler = () => {
        if(!props.userId) return alert('로그인하세요')
        if(Liked){
            axios.post('/api/like/unLikes', {postId:props.postId, userId : props.userId})
            .then(response => {
                if(response.data.success){
                    setLiked(false)
                }else{
                    alert('좋아요 취소 실패')
                }
            })
        }else{
            if(Disliked){
                axios.post('/api/like/unDislikes', {postId:props.postId, userId : props.userId})
                .then(response => {
                    if(response.data.success){
                        setDisliked(false)
                    }else{
                        alert('싫어요 취소 실패')
                    }
                })
            }
            axios.post('/api/like/upLikes', {postId : props.postId, userId : props.userId})
            .then(response => {
                if(response.data.success){
                    setLiked(true)
                    setLikes(Likes+1)
                }else{
                    alert('좋아요 실패')
                }
            })
        }
    }
    const DislikeClickHandler = () => {
        console.log(props.userId)
        if(!props.userId) return alert('로그인하세요')
        if(Disliked){
            axios.post('/api/like/unDislikes', {postId:props.postId, userId : props.userId})
                .then(response => {
                    if(response.data.success){
                        setDisliked(false)
                    }else{
                        alert('싫어요 취소 실패')
                    }
                })
        }else{
            if(Liked){
                axios.post('/api/like/unLikes', {postId:props.postId, userId : props.userId})
                .then(response => {
                    if(response.data.success){
                        setLiked(false)
                    }else{
                        alert('좋아요 취소 실패')
                    }
                })
            }
            axios.post('/api/like/upDislikes', {postId : props.postId, userId : props.userId})
            .then(response => {
                if(response.data.success){
                    setDisliked(true)
                    setLikes(Likes-1)
                }else{
                    alert('싫어요 실패')
                }
            })
        }

    }

    return (
        <div className="like-dislike-span">
            
            <button className="like-button" id={Liked ? "liked-checked":""} onClick={LikeClickHandler}>
                좋아요 <LikeOutlined/> {Likes}
            </button>
            <button className="dislike-button" id={Disliked ? "disliked-checked": ""} onClick={DislikeClickHandler}>
                싫어요 <DislikeOutlined/>
            </button>
        </div>
    );
}

export default LikeDislike;