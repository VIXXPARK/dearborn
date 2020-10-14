import React, { useEffect, useState } from 'react';
import {Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import FilterBox from './Sections/FilterBox';
import axios from 'axios'

const {Title} = Typography

function VoteListPage(props) {

    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [LoadMore, setLoadMore] = useState(true)
    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Ook, setOok] = useState(0); //One of kind
    const [Sort, setSort] = useState(0)

    const [IsBottom, setIsBottom] = useState(false)

    useEffect(() => {
        const variables = {
            ook:0,
            sort :0,
        }
        getPosts(variables)
        //infinite scroll https://hackernoon.com/builing-an-infinite-scroll-using-react-hooks-pe113urj
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])
    useEffect(() => {
        if(IsBottom && LoadMore){
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
        }
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
                alert('데이터 가져오기 실패')
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

    const renderPage = (post) => (
        <div className="list-item">
            <a href={`/contest/1`}>
                <div className="vote-item">
                    <img className="vote-item-img" src={`http://localhost:8000${post.thumbnail}`} alt/>
                </div>
            </a>
        </div>
    )

    return (
        <div className="list-container">
            <Title style={{fontSize:'40px'}}>V O T E</Title>
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
            <div className="list-wrapper">
                {Posts && Posts.map(post => renderPage(post))}
            </div>
        </div>
    );
}

export default VoteListPage;