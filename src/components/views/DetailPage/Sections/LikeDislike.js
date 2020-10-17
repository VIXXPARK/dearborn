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
        axios.post('/api/like/getlike', {post : props.postId})
        .then(response => {
            if(response.data.success){
                console.log(response.data.likes)
                setLikes(response.data.likes.length)
                response.data.likes.map(like => {
                    if(like.user === props.userId){
                        setLiked(true)
                    }
                })
            }else{
                console.log(response.data.err)
            }
        })

        axios.post('/api/like/getDisliked', {post : props.postId, user : props.userId})
        .then(response => {
            console.log(response.data.dislike)
            if(response.data.success){
                if(response.data.dislike.length !== 0)
                    setDisliked(true)
            }else{
                console.log(response.data.err)
            }
        })
    }, [])

    const LikeClickHandler = () => {
        if(!props.userId) return alert('로그인하세요')
        if(Liked){
            axios.delete('/api/like/down', {data : {post : props.postId, user : props.userId}})
            .then(response => {
                if(response.status === 204){
                    setLiked(false)
                    setLikes(Likes-1)
                }else{
                    console.log(response.data.err)
                }
            })
        }else{
            if(Disliked){
                axios.delete('/api/dislike/down', {data : {post : props.postId, user : props.userId}})
                .then(response => {
                    if(response.status === 204){
                        setDisliked(false)
                    }else{
                        console.log(response.data.err)
                    }
                })
            }
            axios.post('/api/like/up', {post : props.postId, user : props.userId})
            .then(response => {
                if(response.data.success){
                    setLiked(true)
                    setLikes(Likes+1)
                }else{
                    console.log(response.data.err)
                }
            })
        }
    }
    const DislikeClickHandler = () => {
        console.log(props.userId)
        if(!props.userId) return alert('로그인하세요')
        if(Disliked){
            axios.delete('/api/dislike/down', {data : {post : props.postId, user : props.userId}})
                .then(response => {
                    if(response.status === 204){
                        setDisliked(false)
                    }else{
                        console.log(response.data.err)
                    }
                })
        }else{
            if(Liked){
                axios.delete('/api/like/down', {data : {post : props.postId, user : props.userId}})
                .then(response => {
                    if(response.status === 204){
                        setLiked(false)
                        setLikes(Likes-1)
                    }else{
                        console.log(response.data.err)
                    }
                })
            }
            axios.post('/api/dislike/up', {post : props.postId, user : props.userId})
            .then(response => {
                if(response.data.success){
                    setDisliked(true)
                    
                }else{
                    console.log(response.data.err)
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