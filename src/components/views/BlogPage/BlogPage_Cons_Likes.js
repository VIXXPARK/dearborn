import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';
import RepoListPage from '../ListPage/RepoListPage';

const {Title} = Typography

function BlogPage_Cons_Likes(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/info/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                if(response.data.user.job === 1)
                    props.history.push(`/${designer}`)
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
        }
    }, [IsBottom])

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
        axios.post(`/api/info/getLikePosts/?limit=${Limit}&offset=${Skip}`, {id : id})
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

    const renderPost = (repo) => {
        return (
            <div className="prod-works">
                <div className="works-wrapper">
                    <img className="works-thumb" src={`http://localhost:8000${repo.thumbnail}`}/>
                    <div className="works-content">
                        <p>{repo.title}</p>
                        <p>{repo.content}</p>
                    </div>
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
                    <a href={`/${designer}/cons`}><button className="blog-tabs-btn">진행 중</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">likes</button>
                    <a href={`/${designer}/cons/event`}><button className="blog-tabs-btn">이벤트</button></a>
                    <div className="blog-tabs-content">
                        {Repos && Repos.map(repo => renderPost(repo))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Cons_Likes;