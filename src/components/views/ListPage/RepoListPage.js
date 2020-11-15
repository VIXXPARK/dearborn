import React, { useEffect, useLayoutEffect, useState } from 'react';
import {Avatar, Card, Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import FilterBox from './Sections/FilterBox';
import axios from 'axios'
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'
import { Loader } from '../../utils/Loader';
import {ArrowRightOutlined} from '@ant-design/icons'

const {Title} = Typography

function RepoListPage(props) {

    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [Posts, setPosts] = useState([])
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(12)
    const [Ook, setOok] = useState(0); //One of kind
    const [Sort, setSort] = useState(0)
    const [Loading, setLoading] = useState(true)
    const [WindowX, setWindowX] = useState(0)
    const [PostColumn, setPostColumn] = useState(5)

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
            ook:0,
            sort :0,
        }
        setLoading(true)
        getPosts(variables)
        setSkip(Skip+Limit)
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])
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
                console.log(images)
                images[i].style.transform = `translateX(${x}px) translateY(${y}px)`
            }
        }, 500);
    }, [document.querySelectorAll('.item-vote-wrap')])

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
        if(IsBottom && LoadMore){
            addPosts()
        }
    }, [IsBottom])

    const getPosts = (variables) => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post(`/api/post/getRepos/?limit=${Limit}&offset=${Skip}`, variables, config)
        .then(response => {
            console.log(response)
            if(response.data.success){
                console.log(response.data.repos)
                if(response.data.repos < Limit ){
                    setLoadMore(false)
                }
                if(Skip !==0){
                    setPosts([...Posts, ...response.data.repos])
                }else{
                    setPosts(response.data.repos)
                }
            }else{
                console.log(response.data.err)
            }
        }).finally(()=>{
            setLoading(false)
        })
    }


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

    const renderRepoItems = (post)=>{
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" src={convertToS3EP(post.thumbnail)} alt/>
                <div className="item-vote-obv"></div>
                <a href={`/${post.writer}/${post.id}`}>
                <div className="item-vote-show">
                    <div className="item-vote-title">
                        {post.title}
                    </div>
                </div>
                </a>
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
                            <div onClick={()=>handleFilters(22)}>하이힐</div>
                        </div>
                    </div>
                </div>
            </div>
        <div style={{width:'100vw', height:'100vh', marginTop:'40px', backgroundColor:'white'}}>
        <div className="list-container">
            <div className="filter-container">
                <div className="filter-btn">
                    <div style={{width:'100%', height:'100%'}} onClick={OpenSortClick}>정렬</div>
                    <div className="filter-wrapper" id={OpenSort ? "filter-show" : null}>
                        <div style={OpenSort ? null : {display:'none'}}>
                            <Radio.Group onChange={onSortChange} value={Sort}>
                                <Radio value={0}>최신순</Radio><br/>
                                <Radio value={1}>오래된순</Radio><br/>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
            </div>
            <div className="list-wrapper">
                {Posts && Posts.map( (post) => renderRepoItems(post))}
            </div>
        </div>
        {Loading && Loader("spin", "black")}
        </div>
        </>
    );
}

export default RepoListPage;