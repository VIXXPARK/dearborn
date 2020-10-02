import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import BidFailIcon from '../../assets/BidFailIcon.png'
import UserInfoMainPage from '../UserInfoPage/UserInfoMainPage';

const {Title} = Typography

function BlogPage_Cons_Bid(props) {

    const [Posts, setPosts] = useState([])
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
                alert('데이터 가져오기 실패')
            }
        })
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if(IsBottom && LoadMore){
            getPosts()
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
        const variables = {
            uid : id,
        }
        axios.post(`/api/info/getBid/?limit=${Limit}&offset=${Skip}`, variables)
        .then(response => {
            if(response.data.success){
                if(response.data.posts.length < Limit)
                    setLoadMore(false)
                if(Skip !==0){
                    setPosts([...Posts, ...response.data.posts])
                }else{
                    setPosts(response.data.posts)
                }
                
                setSkip(Skip + Limit)
            }
        })
    }

    const renderPost = (post) => {
        return (
            <div className="prod-works">
                <div className="works-wrapper">
                    <div className="bid-wrap">
                        <img className="bid-thumb" src={`http://localhost:8000${post.thumbnail}`}/>
                        <div className="bid-wrap-show">
                            <img className="bid-icon" src={BidFailIcon}/>
                        </div>
                    </div>
                    <div className="blog-bid-content">
                        <p>입찰 최고가 :{post.bid.price}</p>
                        {post.bid.bidder === props.user.userData._id ?<button disabled>최고가로 입찰 중</button> : <button>재입찰</button>}
                    </div>
                </div>
            </div>
            )
    }
    console.log(props.user)
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
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">진행 중</button>
                    <a href={`/${designer}/cons/likes`}><button className="blog-tabs-btn">likes</button></a>
                    <a href={`/${designer}/cons/event`}><button className="blog-tabs-btn">이벤트</button></a>
                    {props.user.userData && props.user.userData.nickname == designer ? <div className="blog-tabs-content">
                        {Posts && Posts.map(post => renderPost(post))}
                    </div> :
                    <div className="blog-tabs-content"><p>본인이 아니므로 볼 수 없습니다.</p></div>
                    }
                </div>
            </div>
        </div>
    );
}

export default BlogPage_Cons_Bid;