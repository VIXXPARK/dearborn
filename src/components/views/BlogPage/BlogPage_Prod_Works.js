import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar, Modal } from 'antd';
import {config} from '../../utils/Token'
import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'

const {Title} = Typography
const {confirm} = Modal

function BlogPage_Prod_Works(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)

    const designer = props.match.params.designer

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/info/getProfile', {nickname:designer}, config)
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
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if(IsBottom && LoadMore){
            getPosts(Designer.id)
            setIsBottom(false)
        }
    }, [IsBottom])
    console.log(Repos)
    const handleScroll = () => {
        const scrollTop= (document.documentElement 
            && document.documentElement.scrollTop)
            || document.body.scrollTop
        const scrollHeight= (document.documentElement 
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;
        if(scrollTop + window.innerHeight >= scrollHeight){
            setIsBottom(true)
        }
    }

    const getPosts = (id) => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post(`/api/info/getWorks/?limit=${Limit}&offset=${Skip}`, {id : id}, config)
                .then(response => {
                    if(response.data.success){
                        if(response.data.repos.length < Limit)
                            setLoadMore(false)
                        if(Skip !==0){
                            setRepos([...Repos, ...response.data.repos])
                        }else{
                            setRepos(response.data.repos)
                        }
                        setSkip(Skip+Limit)
                    }else{
                        console.log(response.data.err)
                    }
                })
    }

    const renderLikes = (repo) => {
        const onMyWorkPick = ()=>{
            confirm({
                icon : null,
                content: <p>대표작품으로 지정하시겠습니까?</p>,
                onOk(){
                    const config = {
                        headers : {
                            Authorization: `Token ${getCookieValue('w_auth')}`
                        }
                    }
                    axios.post('/api/info/setMyWork', {post : repo.id}, config)
                    .then(response => {
                        if(!response.data.success)
                            alert('실패')
                        else
                            alert('대표작품 지정 완료')
                    })
                },

            })
        }
        return (
            <div className="works-wrapper">
                <a href={`/${designer}/${repo.id}`}>
                <div className="works-thumb"><img style={{width:'100%', height:'100%'}} src={convertToS3EP(repo.thumbnail)}/></div>
                </a>
                <div className="works-content">
                    <p>{repo.title}</p>
                    <Button onClick={onMyWorkPick}>대표작품 지정</Button>
                </div>
            </div>
            )
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
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
                    <a href={`/${designer}`}><button className="blog-tabs-btn">대표작</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">작품</button>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">좋아요</button></a>
                    <a href={`/${designer}/bid`}><button className="blog-tabs-btn">진행 중</button></a>
                    <div className="blog-tabs-content">
                    <div className="prod-works">
                            {Repos && Repos.map(repo => renderLikes(repo))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Prod_Works;