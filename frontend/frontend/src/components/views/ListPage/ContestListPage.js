import React, { useEffect, useState } from 'react';
import {Card, Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import axios from 'axios'

const {Title} = Typography

function EventListPage(props) {

    const [OpenSort, setOpenSort] = useState(false)
    const [Contests, setContests] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [Sort, setSort] = useState(0)

    useEffect(() => {
        getPosts({sort : 0})
    }, [])
    
    const getPosts = (variables) => {
        axios.post(`/api/contest/getContests/?limit=${Limit}&offset=${Skip}`, variables)
        .then(response => {
            console.log(3)
            if(response.data.success){
                if(Skip !== 0){
                    setContests([...Contests, ...response.data.contests])
                }else {
                    setContests(response.data.contests)
                }
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }

    const OpenSortClick = () => {
        setOpenSort(!OpenSort)
    }

    const setFilters = (sort) =>{
        const variables = {
            sort : sort,
        }
        console.log(1)
        getPosts(variables)
        setSkip(0)
    }

    const onSortChange = (e) => {
        setSort(e.target.value)

        setFilters(e.target.value)
    }

    const renderContest = (contest) => (
        <div className="event-list-item">
            <a href={`/contest/${contest.id}`}>
                <div className="event-item">
                    <img className="event-item-img" src={`http://localhost:8000${contest.image}`} alt/>
                    <div className="event-item-content">
                        <h1>{contest.title}</h1>
                        <h2>{contest.description}</h2>
                    </div>
                </div>
            </a>
        </div>
    )

    return (
        <div className="list-container">
            <Title style={{fontSize:'60px'}}>Contest</Title>
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
                {Contests && Contests.map(contest => renderContest(contest))}
            </div>
        </div>
    );
}

export default EventListPage;