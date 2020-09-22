import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import BidFailIcon from '../../assets/BidFailIcon.png'

const {Title} = Typography

function BlogPage_Cons_Bid(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/post/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                setRepos(response.data.repos)
                setDesigner(response.data.user)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const renderPost = (repo) => {
        return (
            <Card
                className="item"
                cover={<a href={`/${Designer.nickname}/${repo.id}`}><img src={`http://localhost:8000${repo.images[0]}`} alt/></a>}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={repo.title}
                    description={repo.content}
                />
            </Card>
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
                        <p id="blog-header-p1">Content</p>
                        <p id="blog-header-p2">job/major</p>
                    </div>
                </div>
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">진행 중</button>
                    <a href={`/${Designer.nickname}/cons/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <a href={`/${Designer.nickname}/cons/event`}><button className="blog-tabs-btn">이벤트</button></a>
                    <div className="blog-tabs-content">
                        <div className="prod-works">
                            <div className="works-wrapper">
                                <div className="bid-wrap">
                                    <img className="bid-thumb" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                                    <div className="bid-wrap-show">
                                        <img className="bid-icon" src={BidFailIcon}/>
                                    </div>
                                </div>
                                <div className="blog-bid-content">
                                    <p>입찰번호 : </p>
                                    <p>입찰 최고가 :</p>
                                    <button>재입찰</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="blog-left-intro">
                <h1>입찰 진행중 : {}개</h1>
                <h1>입찰 완료 : {}개</h1>
                <h1>이벤트 개최중 : {}개</h1>
            </div>
        </div>
    );
}

export default BlogPage_Cons_Bid;