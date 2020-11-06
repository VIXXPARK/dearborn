import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

import UserInfoMainPage from '../UserInfoPage/UserInfoMainPage';
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'
import { Link } from 'react-router-dom';

const {Title} = Typography

function BlogPage_Cons_Bid(props) {

    const [Posts, setPosts] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)

    const designer = props.match.params.designer
    console.log(Posts)
    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/info/getProfile', {nickname:designer}, config)
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
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post(`/api/info/getBid/?limit=${Limit}&offset=${Skip}`, variables, config)
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
            }else{
                console.log(response.data.err)
            }
        })
    }
    console.log(Posts)

    const renderPost = (post) => {
        return (
            <div className="prod-works">
                <div className="works-wrapper">
                    <div className="bid-wrap">
                        <img className="bid-thumb" src={convertToS3EP(post.thumbnail)}/>
                        {props.user.userData && props.user.userData._id === post.bid.bidder ? 
                        <div className="bid-wrap-show" style={{backgroundColor:'rgb(81, 159, 229)'}}>
                        </div>
                        :
                        <div className="bid-wrap-show" style={{backgroundColor:'tomato'}}>
                        </div>
                        }
                    </div>
                    <div className="blog-bid-content">
                        <p>입찰 최고가 :{post.bid.price}</p>
                        {post.bid.bidder === props.user.userData._id ?
                        <button disabled>최고가로 입찰 중</button> 
                        : 
                        <Link to = {{pathname:'/', search:`designer=${post ? post.designer : null}&postId=${post ? post.postid : null}`}}>
                            <button>재입찰</button>
                        </Link>
                        }
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
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">진행 중</button>
                    <a href={`/${designer}/cons/likes`}><button className="blog-tabs-btn">좋아요</button></a>
                    <a href={`/${designer}/cons/event`}><button className="blog-tabs-btn">이벤트</button></a>
                    {props.user.userData && props.user.userData.nickname === designer ? <div className="blog-tabs-content">
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