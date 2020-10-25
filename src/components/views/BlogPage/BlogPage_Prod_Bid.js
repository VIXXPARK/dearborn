import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import BidSuccessIcon from '../../assets/BidSuccessIcon.png'
import BidFailIcon from '../../assets/BidFailIcon.png'
import {convertToS3EP} from '../../utils/String'

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
                console.log(response.data.err)
            }
        })
    }, [])
    console.log(Posts)
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
                console.log(response.data.err)
            }
        })
    }

    const renderPost = (post) => {
        return (
            <div className="works-wrapper">
                <div className="bid-wrap">
                    <img className="bid-thumb" src={convertToS3EP(post.thumbnail)}/>
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
                    <Avatar style={{float:'left'}} size={200} src={Designer && Designer.profileImage[0] ? convertToS3EP(Designer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job===1 ? "디자이너" : "클라이언트"}/{Designer.major}</p>
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