import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                alert('Failed to get likes')
            }
        })
    }, [])

    return (
        <div>
            
        </div>
    );
}

export default LikeDislike;