import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

const {Title} = Typography

function BlogPage_Prod_Likes(props) {

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

    const renderLikes = () => {
        return (
            <div className="works-wrapper">
                <img className="works-thumb" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                <div className="works-content">
                    <p>Title</p>
                    <p>Content</p>
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
                        <p id="blog-header-p1">Content</p>
                        <p id="blog-header-p2">job/major</p>
                    </div>
                </div>
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <a href={`/${Designer.nickname}`}><button className="blog-tabs-btn">about</button></a>
                    <a href={`/${Designer.nickname}/works`}><button className="blog-tabs-btn">works</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">likes</button>
                    <a href={`/${Designer.nickname}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                        <div className="prod-works">
                            {renderLikes()}
                            {renderLikes()}
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

export default BlogPage_Prod_Likes;