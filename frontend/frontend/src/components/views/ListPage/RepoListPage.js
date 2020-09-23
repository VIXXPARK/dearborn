import React, { useEffect, useState } from 'react';
import {Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import FilterBox from './Sections/FilterBox';
import axios from 'axios'

const {Title} = Typography

function RepoListPage(props) {

    const [OpenSort, setOpenSort] = useState(false)
    const [OpenFilter, setOpenFilter] = useState(false)
    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Ook, setOok] = useState(1); //One of kind
    const [Sort, setSort] = useState(0)

    useEffect(() => {
        const variables = {
            skip:Skip,
            limit:Limit,
        }

        getPosts(variables)
    }, [])

    const getPosts = (variables) => {
        axios.post(`/api/post/getRepos/?limit=${variables.limit}&offset=${variables.skip}`, variables)
        .then(response => {
            if(response.data.success){
                setPosts([...Posts, ...response.data.posts])
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
            skip : 0,
            limit : Limit,
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
    }

    const renderPage = () => (
        <div className="list-item">
            <a href={`/contest/1`}>
                <div className="event-item">
                    <img className="event-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt/>
                    <div className="event-item-content">
                        <h1>Title</h1>
                        <h2>Description</h2>
                    </div>
                </div>
            </a>
        </div>
    )

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
                                <Radio value={1}>최신순</Radio><br/>
                                <Radio value={2}>오래된순</Radio><br/>
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

export default RepoListPage;