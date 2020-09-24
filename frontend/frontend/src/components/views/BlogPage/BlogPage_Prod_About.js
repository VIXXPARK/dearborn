import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

const {Title} = Typography

function BlogPage_Prod_About(props) {

    const [Rep, setRep] = useState(null)
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
                        setRep(response2.data.rep)
                    }else{
                        alert('대표작품 가져오기 실패')
                    }
                })
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

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
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">about</button>
                    <a href={`/${Designer.nickname}/works`}><button className="blog-tabs-btn">works</button></a>
                    <a href={`/${Designer.nickname}/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <a href={`/${Designer.nickname}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                        <div className="prod-about">
                            <div className="prod-about-title">
                                User 님의 대표작품
                            </div>
                            <div className="prod-about-content">
                                <img src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                            </div>
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

export default BlogPage_Prod_About;