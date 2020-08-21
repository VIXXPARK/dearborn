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

        axios.post('/api/like/getDislikes', {postId : props.postId, userId : props.userId})
        .then(response => {
            if(response.data.success){
                if(response.data.dislikes)
                    setDisliked(true)
            }else{
                alert('싫어요 가져오기 실패')
            }
        })
    }, [])

    return (
        <div className="like-dislike-span">
            <button className="like-button">
                좋아요
            </button>
            <button className="dislike-button">
                싫어요
            </button>
        </div>
    );
}

export default LikeDislike;