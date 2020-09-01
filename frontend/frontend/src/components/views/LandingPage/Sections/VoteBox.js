import React, { useState, useEffect, useRef } from 'react';
import {Card, Button, Col, Row} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'
import VoteDetailPage from '../../DetailPage/VoteDetailPage'
import { useSelector } from 'react-redux';

const {Meta} = Card

function VoteBox(props) {

    const [VotePost, setVotePost] = useState([])
    const [Disabled, setDisabled] = useState(false)

    const loginedUser = window.localStorage.getItem('userId')

    const onClick = () =>{
        const variables = {
            user : window.localStorage.getItem('userId'),
            post : props.post.id
        }
        axios.post('/api/vote/upVote', variables)
        .then(response =>{
            if(response.data.success){
                alert('투표되었습니다')
                setDisabled(true)
            }else{
                alert('투표 실패')
            }
        })
    }



    return (
        <Col className="item-vote" lg={8} md={12} xd={24}>
            <img className="item-vote-img" src={`http://localhost:8000${props.post.thumbnail}`} alt/>
            <div className="item-vote-show">
                <div id="go-detail" >
                    <Link to = {{pathname:'/', search:`designer=${props.post ? props.post.writer : null}&postId=${props.post ? props.post.id : null}`}}>자세히보기</Link>
                </div>
                {loginedUser && <Button id="button-vote" onClick={onClick} disabled={props.isDisabledVote || Disabled}>투표하기</Button>}
            </div>
        </Col>
    )
}

export default VoteBox;