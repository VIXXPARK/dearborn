import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import './Sections/LandingPage.css'
import { Card, Radio} from 'antd';
import {Link} from 'react-router-dom'
import FilterBox from '../ListPage/Sections/FilterBox'
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'
import {Loader} from '../../utils/Loader'


import {UpOutlined, DownOutlined} from '@ant-design/icons'
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
        setLoading(true)
        getPosts(variables)
        setSkip(Skip+Limit)
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
            let imgStack
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
                imgStack[minIndex] += (images[i].children[0].height + 15)
                images[i].style.transform = `translateX(${x}px) translateY(${y}px)`
            }
        }, 500);
    }, [document.querySelectorAll('.item-vote-wrap'), PostColumn])

    useEffect(() => {
        if(IsBottom && LoadMore && !Loading){
            addPosts()
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
        }else{
            setIsBottom(false)
        }
    }

    const getPosts = (variables) => {
        console.log(1)
        axios.post(`/api/post/getVotes/?limit=${Limit}&offset=${Skip}`, variables)
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
        setLoading(true)
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
        getPosts(variables)
        setIsBottom(false)
    }

    const ShowMainBanner = () => {
        setMainBanner(!MainBanner)
    }

    const renderVoteItems = (post) => {
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" src={convertToS3EP(post.thumbnail)} alt/>
                <div className="item-vote-obv"></div>
                <Link to = {{pathname:'/', search:`designer=${post ? post.writer : null}&postId=${post ? post.id : null}`}}>
                    <div className="item-vote-show">
                        <div className="item-vote-title">
                            {post.title}
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <>
        <div style={{width:'100%', maxWidth:'1400px', margin:'0 auto', height: 'calc( 100vh - 10px)',}}>
            <div className="main-banner-background" style={{maxHeight:`${MainBanner? 'calc(100% - 200px)' : `20px`}`}}>
                <div style={{maxWidth:'1400px', margin:'0 auto'}}>
                    <div className="post-rank">
                        <PostRankBox/>
                    </div>
                </div>
            </div>
            <div className="vote" style={{width:'100%', height:'100%', margin:'0 auto', backgroundColor:'white', zIndex:'1000'}}>
                <div style={{margin: '0 auto', maxWidth:'1400px', width:'100%',}}> 
                    <div style={{width:'100%',textAlign:'center'}}>
                        <span style={{float:'left', fontSize:'20px', fontWeight:'bold', color:'black'}}>이번 주 포스팅</span>
                        {MainBanner ? 
                        <UpOutlined style={{fontSize:'30px', textAlign:'center'}} onClick={ShowMainBanner}/>
                        :
                        <DownOutlined style={{fontSize:'30px', textAlign:'center'}} onClick={ShowMainBanner}/>
                        }
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
                        {Posts.map((post) => (
                            renderVoteItems(post)
                        ))}
                    </div>
                </div>
            </div>
        </div>
        {Loading && Loader("spin", "black")}
        </>
    );
}

export default LandingPage;