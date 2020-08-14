import React, { useState, useEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import VoteBox from './Sections/VoteBox'
import './Sections/Vote.css'
import { useSelector } from 'react-redux';
import { Row } from 'antd';

function LandingPageVote(props) {

    const [Posts, setPosts] = useState([])
    const [VotePost, setVotePost] = useState([])

    
    
    useEffect(() => {
        axios.get('/api/post/getPosts')
        .then(response => {
            if(response.data.success){
                setPosts(response.data.posts)
            }
        })
        axios.post('/api/vote/myVote', {userId : localStorage.getItem('userId')})
        .then(response => {
            if(response.data.success){
                let variable = response.data.posts.map(post => post.postId)
                setVotePost(variable)
            }else{
                alert('투표정보 가져오기 실패')
            }
        })
    }, [])

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div className="rank">
                <RankBox />
            </div>
            <div className="vote">
                <div className="container-vote">
                    <div className="container-vote-header">
                        Let's Vote!!
                    </div>
                    <div className="container-vote-section">
                        <Row gutter={[16,16]}>
                            {Posts.map(post => (
                                <VoteBox post = {post} myVote={VotePost} isDisabledVote={VotePost.indexOf(post._id) !== -1 ? true : false }/>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPageVote;