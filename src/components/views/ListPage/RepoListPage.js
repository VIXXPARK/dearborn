import React, { useEffect, useState } from 'react';
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
            let imgStack = [0,0,0,0,0]
            let colWidth = 256;
            for(let i=0; i<images.length; i++){
                let minIndex = imgStack.indexOf(Math.min.apply(0, imgStack))
                let x = colWidth * minIndex
                let y = imgStack[minIndex]
                imgStack[minIndex] += (images[i].children[0].height + 15)
                console.log(images)
                images[i].style.transform = `translateX(${x}px) translateY(${y}px)`
            }
        }, 100);
    }, [document.querySelectorAll('.item-vote-wrap')])

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
        <div style={{width:'100vw', height:'100vh', backgroundColor:'white'}}>
        <div className="list-container">
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
        {Loading && Loader("spin", "black")}
        </div>
    );
}

export default RepoListPage;