import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import {getCookieValue} from '../../utils/Cookie'
import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';
import {convertToS3EP} from '../../utils/String'

const {Title} = Typography

function BlogPage_Prod_About(props) {

    const [About, setAbout] = useState("")
    const [Designer, setDesigner] = useState("")

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            console.log(response)
            if(response.data.success){
                if(response.data.user.job === 2)
                    props.history.push(`/${designer}/cons`)
                setDesigner(response.data.user)
                getAbout(response.data.user.id)
            }else{
                console.log(response.data.err)
            }
        })
    }, [])

    const getAbout = (id) => {
        axios.post('/api/info/getAbout', {user:id})
        .then(response => {
            console.log(response)
            if(response.data.success){
                setAbout(response.data.about)
            }else{
                console.log(response.data.err)
            }
        })
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                <div className="blog-header">
                    <Avatar style={{display:'inline-block'}} size={200} src={Designer && Designer.profileImage[0] ? convertToS3EP(Designer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
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
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">about</button>
                    <a href={`/${designer}/works`}><button className="blog-tabs-btn">works</button></a>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <a href={`/${designer}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                        <div className="prod-about">
                            <div className="prod-about-title">
                                User 님의 대표작품
                            </div>
                            <div className="prod-about-content">
                                {About && <a href={`/${designer}/${About.id}`}><img src={convertToS3EP(About.thumbnail)}/></a>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Prod_About;