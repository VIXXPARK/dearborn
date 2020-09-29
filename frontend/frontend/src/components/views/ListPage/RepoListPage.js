import React, { useEffect, useState } from 'react';
import {Avatar, Card, Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import FilterBox from './Sections/FilterBox';
import axios from 'axios'

const {Title} = Typography

function RepoListPage(props) {

    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [Posts, setPosts] = useState([])
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Ook, setOok] = useState(0); //One of kind
    const [Sort, setSort] = useState(0)

    useEffect(() => {
        const variables = {
            ook:0,
            sort :0,
        }

        getPosts(variables)
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if(IsBottom && LoadMore){
            addPosts()
        }
    }, [IsBottom])

    const getPosts = (variables) => {
        axios.post(`/api/post/getRepos/?limit=${Limit}&offset=${Skip}`, variables)
        .then(response => {
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
                alert('데이터 가져오기 실패')
            }
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

    const renderRepoItems = (post)=>{
        
        return  (
        <Card
            className="item"
            hoverable={false}
            cover={<a href={`/${post.writer}/${post.id}`}><img src={`http://localhost:8000${post.thumbnail}`} alt/></a>}
        >
            <Meta
                avatar={<Avatar src={`http://localhost:8000${post.profileImage}`}/>}
                title={post.title}
                description={<a href={`/${post.writer}`}>{post.writer}</a>}
            />
        </Card>
        )
        
    }

    return (
        <div className="list-container">
            <Title style={{fontSize:'60px'}}>Repository</Title>
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
                            </Radio.Group>
                        </div>
                    </div>
                </div>
            </div>
            <div className="list-wrapper">
                {Posts && Posts.map( (post) => renderRepoItems(post))}
            </div>
        </div>
    );
}

export default RepoListPage;