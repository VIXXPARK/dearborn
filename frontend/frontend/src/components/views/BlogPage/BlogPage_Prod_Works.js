import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar, Modal } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

const {Title} = Typography
const {confirm} = Modal

function BlogPage_Prod_Works(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                setDesigner(response.data.user)
                getPosts(response.data.user.id)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const getPosts = (id) => {
        axios.post(`/api/info/getWorks/?limit=${Limit}&offset=${Skip}`, {id : id})
                .then(response => {
                    if(response.data.success){
                        setRepos(response.data.repos)
                        setSkip(Skip+Limit)
                    }else{
                        alert('대표작품 가져오기 실패')
                    }
                })
    }

    const renderLikes = (repo) => {
        const onMyWorkPick = ()=>{
            confirm({
                icon : null,
                content: <p>대표작품으로 지정하시겠습니까?</p>,
                onOk(){
                    axios.post('/api/info/SetMyWork', {id : repo.id})
                    .then(response => {
                        if(!response.data.success)
                            alert('실패')
                    })
                },

            })
        }
        return (
            <div className="works-wrapper">
                <img className="works-thumb" src={`http://localhost:8000${repo.thumbnail}`}/>
                <div className="works-content">
                    <p>{repo.title}</p>
                    <p>{repo.content}</p>
                </div>
                <Button style={{float:'right', marginTop:'100px'}} onClick={onMyWorkPick}>대표작품 지정</Button>
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
                <div className="blog-follow">
                    <Button>follow</Button>
                </div>
                <div className="blog-section">
                    <a href={`/${designer}`}><button className="blog-tabs-btn">about</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">works</button>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <a href={`/${designer}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                    <div className="prod-works">
                            {Repos && Repos.map(repo => renderLikes(repo))}
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

export default BlogPage_Prod_Works;