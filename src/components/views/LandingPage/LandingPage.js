import React, { useState, useEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import './Sections/LandingPage.css'
import { Card, Radio} from 'antd';
import {Link} from 'react-router-dom'
import FilterBox from '../ListPage/Sections/FilterBox'


import {ArrowRightOutlined} from '@ant-design/icons'

const {Meta} = Card

function LandingPage(props) {


    const [VotePosts, setVotePosts] = useState([])
    const [Voted, setVoted] = useState([])
    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [LoadMore, setLoadMore] = useState(true)
    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Ook, setOok] = useState(0); //One of kind
    const [Sort, setSort] = useState(0)
    const [IsBottom, setIsBottom] = useState(false)

    console.log(VotePosts)
    useEffect(() => {
        const variables = {
            ook : 0,
            sort : 0,
        }
        getPosts(variables)
        if(window.localStorage.getItem('userId')){
        axios.post('/api/vote/myVote', {user : window.localStorage.getItem('userId')})
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                let variable = response.data.posts
                setVoted(variable)
            }else{
                console.log(response.data.err)
            }
        })}
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

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

    const getPosts = (variables) => {
        console.log(variables)
        axios.post(`/api/post/getVotes/?limit=${Limit}&offset=${Skip}`, variables)
        .then(response => {
            if(response.data.success){
                console.log(response)
                if(response.data.votes.length < Limit)
                    setLoadMore(false)
                if(Skip !==0){
                    console.log(1)
                    setPosts([...Posts, ...response.data.votes])
                }else{
                    setPosts(response.data.votes)
                }
            }else{
                console.log(response.data.err)
            }
        })
    }

    const OpenFilterClick = () => {
        setOpenSort(false)
        setOpenFilter(!OpenFilter)
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
        getPosts(variables)
        setSkip(0)
    }

    const handleFilters = (ook) => {
        setOok(ook)

        showFilteredResults(ook)
    }

    const onSortChange = (e) => {
        setSort(e.target.value)
        const variables = {
            ook : Ook,
            sort : e.target.value,
        }
        getPosts(variables)
        setSkip(0)
    }

    const addPosts = () => {
        const variables = {
            ook : Ook,
            sort : Sort
        }
        setSkip(Skip+Limit)
        getPosts(variables)
        setIsBottom(false)
    }

    const renderVoteItems = (post) => {
        console.log(post)
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" src={`http://localhost:8000${post.thumbnail}`} alt/>
                <div className="item-vote-show">
                    <div id="go-detail" >
                        <Link to = {{pathname:'/', search:`designer=${post ? post.writer : null}&postId=${post ? post.id : null}`}}><div id="go-detail-icon"><ArrowRightOutlined /></div></Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
        <div style={{width:'95%', margin:'3rem auto'}}>
            <div className="main-banner-container">
                <div className="main-banner-text">
                    당신의 패션 디자인을 팔아보세요.<br/>
                    아마추어 디자이너들을 환영합니다!
                </div>
                <div className="main-banner-background"></div>
                <div className="rank">
                    <p style={{width:'100%',fontSize:'30px', textAlign:'center'}}>지난 주 랭킹</p>
                    <RankBox />
                </div>
            </div>
            <div className="vote">
                <div style={{margin: '0 auto'}}> 
                    <div style={{textAlign:'left',}}>
                        <span style={{textAlign:'left', fontSize:'20px', fontWeight:'bold', color:'black'}}>이번 주에 올라온 디자인</span>
                    </div>
                    <div className="filter-container">
                        <div className="filter-btn">
                            <div style={{width:'100%', height:'100%'}} onClick={OpenFilterClick}>필터</div>
                            <div className="filter-wrapper" id={OpenFilter ? "filter-show" : null}>
                                <FilterBox 
                                    open={OpenFilter}
                                    handleFilters={ook => handleFilters(ook)}
                                />
                            </div>
                        </div>
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
                        {VotePosts.map((post) => (
                            renderVoteItems(post)
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default LandingPage;