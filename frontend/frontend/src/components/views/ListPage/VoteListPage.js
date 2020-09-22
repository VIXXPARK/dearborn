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
    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Filters, setFilters] = useState({
        filterList:[],
        sortValue:1,
    })

    useEffect(() => {
        const variables = {
            skip:Skip,
            limit:Limit,
        }

        getPosts(variables)
    }, [])

    const getPosts = (variables) => {
        axios.post('/api/post/getPosts', variables)
        .then(response => {
            if(response.data.success){
                if(variables.loadMore){
                    setPosts([...Posts, ...response.data.posts])
                }else {
                    setPosts(response.data.posts)
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

    const showFilteredResults = (filters) =>{
        const variables = {
            skip : 0,
            limit : Limit,
            filters : filters
        }
        getPosts(variables)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const onSortChange = (e) => {
        const newFilters = {...Filters}
        newFilters["sortValue"] =e.target.value

        setFilters(newFilters)
    }

    const renderPage = () => (
        <div className="list-item">
            <a href={`/contest/1`}>
                <div className="vote-item">
                    <img className="vote-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt/>
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
                            handleFilters={filters => handleFilters(filters, "filterList")}
                        />
                    </div>
                </div>
                <div className="filter-btn">
                    <div style={{width:'100%', height:'100%'}} onClick={OpenSortClick}>정렬</div>
                    <div className="filter-wrapper" id={OpenSort ? "filter-show" : null}>
                        <div style={OpenSort ? null : {display:'none'}}>
                            <Radio.Group onChange={onSortChange} value={Filters.sortValue}>
                                <Radio value={1}>최신순</Radio><br/>
                                <Radio value={2}>오래된순</Radio><br/>
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
                {renderPage()}
                {renderPage()}
                {renderPage()}
                {renderPage()}
                {renderPage()}
                {renderPage()}
            </div>
        </div>
    );
}

export default VoteListPage;