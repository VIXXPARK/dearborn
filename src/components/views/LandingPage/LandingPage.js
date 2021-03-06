import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import './Sections/LandingPage.css'
import { Card, Radio, Rate} from 'antd';
import {Link} from 'react-router-dom'
import {convertToS3EP, convertToLocal} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'
import {Loader} from '../../utils/Loader'
import {getCategoryName} from '../../utils/Category'

import Bot from '../../assets/bot.png'


import {HomeFilled ,PushpinTwoTone,CalendarFilled ,ThunderboltFilled,FileWordFilled, DownOutlined, EyeOutlined, HeartFilled} from '@ant-design/icons'
import PostRankBox from './Sections/PostRankBox';

const {Meta} = Card

function LandingPage(props) {

    const [Voted, setVoted] = useState([])
    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [LoadMore, setLoadMore] = useState(true)
    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(10)
    const [Ook, setOok] = useState(0); //One of kind
    const [Sort, setSort] = useState(0)
    const [IsBottom, setIsBottom] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [MainBanner, setMainBanner] = useState(true)
    const [PostColumn, setPostColumn] = useState(5)
    const [WindowX, setWindowX] = useState(0)
    const [ScrollPercentage, setScrollPercentage] = useState(0)
    const [Rank, setRank] = useState(1)
    const [LastPost, setLastPost] = useState(undefined)
    const [Recommend, setRecommend] = useState([])

    useLayoutEffect(() => {
        function updateSize(){
            setWindowX(window.innerWidth)
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useEffect(() => {
        const variables = {
            ook : 0,
            sort : 0,
        }
        window.addEventListener('scroll', handleScroll)

        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])
    useEffect(() => {
        if(window.innerWidth < 400){
            setPostColumn(1)
        }
        else if(window.innerWidth <700)
        {
            setPostColumn(2)
        }
        else if(window.innerWidth <1000){
            setPostColumn(3)
        }
        else if(window.innerWidth <1300){
            setPostColumn(4)
        }
        else if(window.innerWidth >=1300){
            setPostColumn(5)
        }
    }, [window.innerWidth])
    useEffect(() => {
        setTimeout(() => {
            let images = document.querySelectorAll('.item-vote-wrap')
            let imgStack =[0,0,0,0,0]
            if(PostColumn === 1){
                imgStack = [0]
            }else if(PostColumn === 2){
                imgStack =[0,0]
            }
            else if(PostColumn === 3){
                imgStack =[0,0,0]
            }
            else if(PostColumn === 4){
                imgStack =[0,0,0,0]
            }
            else if(PostColumn === 5){
                imgStack =[0,0,0,0,0]
            }
            let colWidth = 256;
            for(let i=0; i<images.length; i++){
                let minIndex = imgStack.indexOf(Math.min.apply(0, imgStack))
                let x = colWidth * minIndex
                let y = imgStack[minIndex]
                imgStack[minIndex] += (images[i].children[0].height + 65)
                images[i].style.transform = `translateX(${x}px) translateY(${y}px)`
            }
        }, 500);
    }, [document.querySelectorAll('.item-vote-wrap'), PostColumn])

    useEffect(() => {
        if(IsBottom && LoadMore && !Loading){
            addPosts()
        }
    }, [IsBottom])

    console.log(Posts)

    useEffect(() => {
        const variables = {
            ook : 0,
            sort : 0,
        }
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        setLoadMore(true)
        setLoading(true)
        var rank = Rank === 2 ? "today/" : Rank === 3? "week/" : Rank===4 ? "month/" : "";
        if(Rank === 1){
            if(LastPost){
                
            axios.post('/api/feature/recommend', { postId : LastPost}, config)
            .then(response => {
                console.log(response)
                if(response.data.success){
                    const recommend = response.data.posts
                    const duplicate = response.data.posts.find((post)=>{
                        return post.id === LastPost
                    })
                    const idx = recommend.indexOf(duplicate)
                    recommend.splice(idx, 1);
                    setRecommend(recommend)
                }else{
                    console.log(response.data.err)
                }
            })}
            addPosts()
        }else{
            setRecommend([])
        axios.get(`/api/post/getVotes/${rank}?limit=${Limit}&offset=${Skip}`, config)
            .then(response => {
                setLoading(true)
                if(response.data.success){
                    console.log(response)
                    if(response.data.votes.length < Limit)
                        setLoadMore(false)
                    if(Skip !==0){
                        setPosts([...Posts, ...response.data.votes])
                    }else{
                        setPosts(response.data.votes)
                    }
                }else{
                    console.log(response.data.err)
                }
            }).finally(()=>{
                setLoading(false)
            })
        }
    }, [Rank])
    const handleScroll = () => {
        const scrollTop= (document.documentElement 
            && document.documentElement.scrollTop)
            || document.body.scrollTop
        const scrollHeight= (document.documentElement 
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;
        if(scrollTop + window.innerHeight >= scrollHeight){
            setIsBottom(true)
        }else{
            setIsBottom(false)
        }
    }

    const getPosts = (variables, SkipRec) => {
            axios.post(`/api/post/getVotes/?limit=${Limit}&offset=${SkipRec===0 ? SkipRec : Skip}`, variables)
            .then(response => {
                console.log(SkipRec ? SkipRec : Skip)
                setLoading(true)
                if(response.data.success){
                    console.log(response)
                    if(response.data.votes.length < Limit)
                        setLoadMore(false)
                    if(SkipRec===0 ? SkipRec !== 0 : Skip !==0){
                        setPosts([...Posts, ...response.data.votes])
                    }else{
                        setPosts(response.data.votes)
                    }
                }else{
                    console.log(response.data.err)
                }
            
            }).finally(()=>{
                setLoading(false)
            })
    }


    const OpenSortClick = () => {
        setOpenFilter(false)
        setOpenSort(!OpenSort)
    }

    const showFilteredResults = (ook) =>{
        const variables = {
            ook : ook,
            sort : Sort,
        }
        setLoadMore(true)
        setLoading(true)
        setSkip(0)
        getPosts(variables, 0)
    }

    const handleFilters = (ook) => {
        setOok(ook)
        setRecommend([])
        showFilteredResults(ook)
    }

    const onSortChange = (e) => {
        setSort(e.target.value)
        const variables = {
            ook : Ook,
            sort : e.target.value,
        }
        setLoading(true)
        getPosts(variables)
        setSkip(0)
    }

    const addPosts = () => {
        const variables = {
            ook : Ook,
            sort : Sort
        }
        setSkip(Skip+Limit)
        setLoading(true)
        getPosts(Rank===1 ? variables : null)
        setIsBottom(false)
    }

    const ShowMainBanner = () => {
        setMainBanner(!MainBanner)
    }

    const handleRank = (rank) => {
        setSkip(0)
        if(rank !== Rank)
        {
            setPosts([])
            setRank(rank)
        }
    }

    const renderRecommendItems = (post) => {
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" style={{border:'3px solid rgb(248, 197, 103)'}} src={convertToLocal(post.thumbnail)} alt/>
                <div className="item-vote-obv"></div>
                <Link to = {{pathname:'/', search: `designer=${post ? post.writer : null}&postId=${post ? post.id : null}`}} onClick={()=>setLastPost(post.id)}>
                    <div className="item-vote-show">
                        <div className="item-vote-title">
                            {post.title}
                        </div>
                        <div className="item-vote-rate">
                            <Rate disabled defaultValue={post.score}/>
                            <div style={{display:'inline-block'}}>({post.score} / 5점)</div>
                        </div>
                        <div className="item-vote-like" style={{color:'black'}}>
                            <div>
                                <HeartFilled style={{color:'tomato', fontSize:'20px', verticalAlign:'middle'}}/>
                                <span style={{fontSize:'10px', marginLeft:'10px'}}>{post.like}</span>
                            </div>
                        </div>
                    </div>
                </Link>
                <div style={{width:'100%', height:'50px'}}>
                    <div style={{width :'50px', height:'50px', display:'inline-block'}}>
                        <img style={{width:'60%', height:'60%',margin:'10px',borderRadius:'20px'}} src={convertToLocal(post.profileImage)}/>
                    </div>
                    <div style={{width:'70px', height:'50px', display: 'inline-block', fontSize:'10px'}}>
                        {post.writer}
                    </div>
                    <div style={{float:'right',width:'40px', fontSize:'10px', lineHeight:'50px', paddingTop:'3px'}}>{post.view}</div>
                    <div style={{float:'right', fontSize:'20px', verticalAlign:'middle', lineHeight:'50px', paddingTop:'5px', marginRight:'5px'}}>
                        <EyeOutlined />
                    </div>
                </div>
            </div>
        )
    }

    const renderVoteItems = (post) => {
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" src={convertToLocal(post.thumbnail)} alt/>
                <div className="item-vote-obv"></div>
                <Link to = {{pathname:'/', search: `designer=${post ? post.writer : null}&postId=${post ? post.id : null}`}} onClick={()=>setLastPost(post.id)}>
                    <div className="item-vote-show">
                        <div className="item-vote-title">
                            {post.title}
                        </div>
                        <div className="item-vote-rate">
                            <Rate disabled defaultValue={post.score}/>
                            <div style={{display:'inline-block'}}>({post.score} / 5점)</div>
                        </div>
                        <div className="item-vote-like" style={{color:'black'}}>
                            <div>
                                <HeartFilled style={{color:'tomato', fontSize:'20px', verticalAlign:'middle'}}/>
                                <span style={{fontSize:'10px', marginLeft:'10px'}}>{post.like}</span>
                            </div>
                        </div>
                    </div>
                </Link>
                <div style={{width:'100%', height:'50px'}}>
                    <div style={{width :'50px', height:'50px', display:'inline-block'}}>
                        <img style={{width:'60%', height:'60%',margin:'10px',borderRadius:'20px'}} src={convertToLocal(post.profileImage)}/>
                    </div>
                    <div style={{width:'70px', height:'50px', display: 'inline-block', fontSize:'10px'}}>
                        {post.writer}
                    </div>
                    <div style={{float:'right',width:'40px', fontSize:'10px', lineHeight:'50px', paddingTop:'3px'}}>{post.view}</div>
                    <div style={{float:'right', fontSize:'20px', verticalAlign:'middle', lineHeight:'50px', paddingTop:'5px', marginRight:'5px'}}>
                        <EyeOutlined />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
        <div style={{position:'fixed',zIndex:'40', top:'100px',width:'100%', height:'40px', backgroundColor:'white',borderTop:'1px solid whitesmoke', boxShadow:'0 4px 4px 0 rgba(0,0,0,0.2), 0 1px 0 0 #d9d9d9'}}>
                <div style={{width:'100%', height:'100%', maxWidth:'1400px', margin:'0 auto', textAlign:'center', lineHeight:'40px'}}>
                    <div className="category" style={{position:'relative',width:'25%', display:'inline-block', fontSize:'12px'}}>
                        남성의류
                        <div className="category-show">
                            <div onClick={()=>handleFilters(1)}>상의</div>
                            <div onClick={()=>handleFilters(2)}>하의</div>
                            <div onClick={()=>handleFilters(3)}>아우터</div>
                            <div onClick={()=>handleFilters(4)}>속옷</div>
                        </div>
                    </div>
                    <div className="category" style={{position:'relative',width:'25%', display:'inline-block', fontSize:'12px'}}>
                        여성의류
                        <div className="category-show">
                            <div onClick={()=>handleFilters(5)}>상의</div>
                            <div onClick={()=>handleFilters(6)}>하의</div>
                            <div onClick={()=>handleFilters(7)}>원피스</div>
                            <div onClick={()=>handleFilters(8)}>아우터</div>
                            <div onClick={()=>handleFilters(9)}>속옷</div>
                        </div>
                    </div>
                    <div className="category" style={{position:'relative',width:'25%', display:'inline-block', fontSize:'12px'}}>
                        악세서리
                        <div className="category-show">
                            <div onClick={()=>handleFilters(10)}>귀걸이</div>
                            <div onClick={()=>handleFilters(11)}>시계</div>
                            <div onClick={()=>handleFilters(12)}>목걸이</div>
                            <div onClick={()=>handleFilters(13)}>팔찌</div>
                            <div onClick={()=>handleFilters(14)}>발찌</div>
                            <div onClick={()=>handleFilters(15)}>안경</div>
                            <div onClick={()=>handleFilters(16)}>반지</div>
                            <div onClick={()=>handleFilters(17)}>모자</div>
                        </div>
                    </div>
                    <div className="category" style={{position:'relative',width:'25%', display:'inline-block', fontSize:'12px'}}>
                        신발
                        <div className="category-show">
                            <div onClick={()=>handleFilters(18)}>단화</div>
                            <div onClick={()=>handleFilters(19)}>스포츠</div>
                            <div onClick={()=>handleFilters(20)}>슬리퍼</div>
                            <div onClick={()=>handleFilters(21)}>샌들</div>
                            <div onClick={()=>handleFilters(22)}>구두</div>
                        </div>
                    </div>
                </div>
            </div>
        <div style={{width:'100%', margin:'0 auto', height: 'calc( 100vh)',}}>
            <div className="main-banner-background" style={{maxHeight:`${MainBanner? 'calc(100vh - 140px)' : `42px`}`}}>
                <div>
                    <div className="post-rank">
                        <PostRankBox/>
                    </div>
                </div>
            </div>
            <div className="vote" style={{width:'100%',maxWidth:'1400px', margin:'0 auto', margin:'0 auto', backgroundColor:'white', zIndex:'1000'}}>
                <div style={{margin: '0 auto', maxWidth:'1400px', width:'100%',}}> 
                    <div style={{width:'100%',textAlign:'center', marginTop:'20px'}}>
                        <span style={{float:'left',marginRight:'10%', cursor:'pointer', fontFamily:'font3', fontWeight:'bold'}} onClick={()=>handleRank(1)} id={Rank === 1 ? 'category-clicked' : null}>{getCategoryName(Ook)}</span>
                        <span style={{float:'left',marginRight:'10%', cursor:'pointer', fontFamily:'font3', fontWeight:'bold'}} onClick={()=>handleRank(2)} id={Rank === 2 ? 'category-clicked' : null}>투데이 인기</span>
                        <span style={{float:'left',marginRight:'10%', cursor:'pointer', fontFamily:'font3', fontWeight:'bold'}} onClick={()=>handleRank(3)} id={Rank === 3 ? 'category-clicked' : null}>주간 인기</span>
                        <span style={{float:'left',marginRight:'10%', cursor:'pointer', fontFamily:'font3', fontWeight:'bold'}} onClick={()=>handleRank(4)} id={Rank === 4 ? 'category-clicked' : null}>월간 인기</span>
                        {MainBanner ? 
                        <div style={{fontSize:'15px', float:'right', cursor:'pointer'}}><a style={{color:'gray'}} onClick={ShowMainBanner}>배너 접기</a></div>
                        :
                        <div style={{fontSize:'15px', float:'right', cursor:'pointer'}}><a style={{color:'gray'}} onClick={ShowMainBanner}>배너 열기</a></div>
                        }
                    </div>
                    <div className="filter-container">
                        <div className="filter-btn">
                            <div style={{width:'100%', height:'100%'}} onClick={OpenSortClick}>정렬</div>
                            <div className="filter-wrapper" id={OpenSort ? "filter-show" : null}>
                                <div style={OpenSort ? null : {display:'none'}}>
                                    <Radio.Group onChange={onSortChange} value={Sort}>
                                        <Radio value={0}>최신순</Radio><br/>
                                        <Radio value={1}>오래된순</Radio><br/>
                                        {/*
                                        <Radio value={3}>좋아요순</Radio><br/>
                                        <Radio value={4}>조회수순</Radio><br/>
                                        결제 시에만 보여줌
                                        */}
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-vote-section">
                        {Recommend.map((post)=>(
                            renderRecommendItems(post)
                        ))}
                        {Posts.map((post) => (
                            renderVoteItems(post)
                        ))}
                    </div>
                </div>
            </div>
        </div>
        {Loading && Loader("spin", "black")}
        <div style={{position:'fixed', bottom:'10%', left:'5%',  width:'40px', height:'200px', border:'1px solid #d9d9d9', boxShadow:'1px 1px 3px #d9d9d9'}}>
            <div id="nav-fix-bar" style={{position:'relative',width:'40px', height:'20%', fontSize:'20px',paddingTop:'10px', textAlign:'center'}} onClick={()=>handleRank(1)}>
                <HomeFilled />
                <div id="nav-fix-bar-extend" style={{position:'absolute', top:0, left:'40px',width:'120px', height:'100%'}}>
                    메인
                </div>
            </div>
            <div id="nav-fix-bar" style={{position:'relative',width:'40px', height:'20%', fontSize:'20px',paddingTop:'10px', textAlign:'center'}} onClick={()=>handleRank(2)}>
                <ThunderboltFilled />
                <div id="nav-fix-bar-extend" style={{position:'absolute', top:0, left:'40px',width:'80px', height:'100%'}}>
                    투데이
                </div>
            </div>
            <div id="nav-fix-bar" style={{position:'relative',width:'40px', height:'20%', fontSize:'20px',paddingTop:'10px', textAlign:'center'}} onClick={()=>handleRank(3)}>
                <FileWordFilled />
                <div id="nav-fix-bar-extend" style={{position:'absolute', top:0, left:'40px',width:'100px', height:'100%'}}>
                    주간 인기
                </div>
            </div>
            <div id="nav-fix-bar" style={{position:'relative',width:'40px', height:'20%', fontSize:'20px',paddingTop:'10px', textAlign:'center'}} onClick={()=>handleRank(4)}>
                <CalendarFilled />
                <div id="nav-fix-bar-extend" style={{position:'absolute', top:0, left:'40px',width:'100px', height:'100%'}}>
                    월간 인기
                </div>
            </div>
        </div>
        </>
    );
}

export default LandingPage;