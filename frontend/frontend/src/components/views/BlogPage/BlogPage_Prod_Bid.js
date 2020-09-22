import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import BidSuccessIcon from '../../assets/BidSuccessIcon.png'
import BidFailIcon from '../../assets/BidFailIcon.png'

const {Title} = Typography

function BlogPage_Prod_Bid(props) {

    const [Bids, setBids] = useState([])
    const [Designer, setDesigner] = useState("")

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                setDesigner(response.data.user)
                axios.post('/api/info/getAbout', {userId : response.data.user.id})
                .then(response2 => {
                    if(response2.data.success){
                        setBids(response2.data.bids)
                    }else{
                        alert('대표작품 가져오기 실패')
                    }
                })
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const renderPost = () => {
        return (
            <div className="works-wrapper">
                <div className="bid-wrap">
                    <img className="bid-thumb" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                </div>
                <div className="blog-bid-content">
                    <p>입찰 최고가 : {Bids.price}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
                <div className="blog-header">
                    <Avatar style={{float:'left'}} size={200} src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job}/{Designer.major}</p>
                    </div>
                </div>
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <a href={`/${Designer.nickname}`}><button className="blog-tabs-btn">about</button></a>
                    <a href={`/${Designer.nickname}/works`}><button className="blog-tabs-btn">works</button></a>
                    <a href={`/${Designer.nickname}/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">진행 중</button>
                    <div className="blog-tabs-content">
                        <div className="prod-works">
                            {renderPost()}
                            {renderPost()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="blog-left-intro">
                <h1>Works : {}개</h1>
                <h1>Likes : {}개</h1>
                <h1>Views : {}개</h1>
            </div>
        </div>
    );
}

export default BlogPage_Prod_Bid;