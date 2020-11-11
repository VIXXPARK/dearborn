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
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/info/getProfile', {nickname:designer}, config)
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
    console.log(About)

    const getAbout = (id) => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/info/getAbout', {user:id}, config)
        .then(response => {
            console.log(response)
            if(response.data.success){
                setAbout(response.data.about)
            }else{
                console.log(response.data.err)
            }
        })
    }
    console.log(About)
    return (
        <div className="blog-container">
            <div className="blog-right-container">
                <div className="blog-header">
                    <div style={{width:'200px', height:'200px',float:'left'}}>
                        <img style={{display:'inline-block', verticalAlign:'top', width:'100%', height:'100%', background:'rgba(0,0,0, 0.05)', borderRadius:'100px'}} src={Designer && Designer.profileImage[0] ? convertToS3EP(Designer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                    </div>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job===1 ? "디자이너" : "클라이언트"}</p>
                        <p>Works : {Designer.work}개</p>
                        <p>Likes : {Designer.like}개</p>
                        <p>Views : {Designer.view}개</p>
                    </div>
                </div>
                <div className="blog-section">
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">대표작</button>
                    <a href={`/${designer}/works`}><button className="blog-tabs-btn">작품</button></a>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">좋아요</button></a>
                    <a href={`/${designer}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                        <div className="prod-about">
                            <div className="prod-about-title">
                                User 님의 대표작품
                            </div>
                            {About && About.id ? <div style={{marginLeft:'150px', marginRight:'150px'}}>
                                <div style={{width:'50%',height:'100%',textAlign:'center', display:'inline-block', backgroundColor:'white',verticalAlign:'top', wordBreak:'break-all'}}>
                                    <div style={{width:'100%', marginTop:'35%'}}>
                                        <p style={{overflow:'hidden', textOverflow:'ellipsis', fontSize:'2rem'}}>{About.title}</p>
                                        <p style={{overflow:'hidden', textOverflow:'ellipsis', fontSize:'1rem'}}>{About.content}</p>
                                    </div>
                                    <div>
                                        <div style={{width:'90%',maxWidth:'400px',height:'70px',marginTop:'10%', borderRadius:'30px',fontSize:'1.5rem', backgroundColor:'#f85272', display:'inline-block', lineHeight:'80px'}}>
                                            작품 보러 가기
                                        </div>
                                    </div>
                                </div>
                                <div style={{width:'50%',height:'100%', display:'inline-block', backgroundColor:'gray', overflow:'hidden', wordBreak:'break-all'}}>
                                    <img style={{width:'100%'}} src={convertToS3EP(About.thumbnail)}/>
                                </div>
                            </div> : <div style={{textAlign:'center', margin:'40px'}}>대표작 없음</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Prod_About;