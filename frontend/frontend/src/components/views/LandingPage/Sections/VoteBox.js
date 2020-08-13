import React, { useState, useEffect, useRef } from 'react';
import {Card, Button, Col, Row} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'
import VoteDetailPage from '../../DetailPage/VoteDetailPage'

const {Meta} = Card

function VoteBox(props) {

    const [DetailVisible, setDetailVisible] = useState(false)
    const [Posts, setPosts] = useState([])

    useEffect(() => {
        
        axios.get('/api/post/getPosts')
        .then(response => {
            if(response.data.success){
                setPosts(response.data.posts)
            }
        })
    }, [DetailVisible])

    
    const renderCards = (post) => {
        
        const onVoteClick = () => {
            if(!props.user.userData.isAuth){
                props.history.push('/login')
            }else{
            const data = {
                userId: props.user.userData._id,
                postId: post._id
            }
    
            axios.post('/api/vote/upVote', data)
            .then(response => {
                if(response.data.success){
                    alert('투표되었습니다!')
                }else{
                    alert('투표 실패')
                }
            })
            }
        }
        return (
            <>
            <Col className="item-vote" lg={8} md={12} xd={24}>
                <img className="item-vote-img" src={`http://localhost:5000/${post.images[0]}`} alt/>
                <div className="item-vote-show">
                    <div id="go-detail" >
                        <Link to = {{pathname:'/', search:`?designer=${post.writer}`}}>자세히보기</Link>
                    </div>
                    <Button id="button-vote" onClick={onVoteClick}>투표하기</Button>
                </div>
            </Col>
            </>
        )
    }
    
    return (
        <>
        
        <div className="container-vote">
            <div className="container-vote-header">
                Let's Vote!!
            </div>
            <div className="container-vote-section">
                <Row gutter={[16,16]}>
                    {Posts.map(post => (
                        renderCards(post)
                    ))}
                </Row>
            </div>
        </div>
        </>
    );
}

export default VoteBox;