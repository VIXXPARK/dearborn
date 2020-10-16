import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import BidSuccessIcon from '../../assets/BidSuccessIcon.png'
import BidFailIcon from '../../assets/BidFailIcon.png'

const {Title} = Typography

function BlogPage_Prod_Bid(props) {

    const [Posts, setPosts] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                if(response.data.user.job === 2)
                    props.history.push(`/${designer}/cons`)
                setDesigner(response.data.user)
                getPosts(response.data.user.id)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const getPosts = (id) => {
        const variables = {
            uid : id
        }
        axios.post(`/api/info/getBid/?limit=${Limit}&offset=${Skip}`,variables)
        .then(response => {
            if(response.data.success){
                setPosts(response.data.posts)
                setSkip(Skip+Limit)
            }else{
                alert('실패')
            }
        })
    }

    const renderPost = (post) => {
        console.log(post)
        return (
            <div className="works-wrapper">
                <div className="bid-wrap">
                    <img className="bid-thumb" src={`http://localhost:8000${post.thumbnail}`}/>
                </div>
                <div className="blog-bid-content">
                    <p>{post.title}</p>
                    <p>입찰 최고가 : {post.price}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
                <div className="blog-header">
                    <Avatar style={{float:'left'}} size={200} src={`http://localhost:8000${Designer.profileImage}`}/>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job}/{Designer.major}</p>
                    </div>
                </div>
                <div className="blog-intro">
                    <h1>Works : {Designer.work}개</h1>
                    <h1>Likes : {Designer.like}개</h1>
                    <h1>Views : {Designer.view}개</h1>
                </div>
                <div className="blog-section">
                    <a href={`/${designer}`}><button className="blog-tabs-btn">about</button></a>
                    <a href={`/${designer}/works`}><button className="blog-tabs-btn">works</button></a>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">진행 중</button>
                    <div className="blog-tabs-content">
                        <div className="prod-works">
                            {Posts && Posts.map(post => renderPost(post))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Prod_Bid;