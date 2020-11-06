import React, { useEffect, useState } from 'react';
import {Card, Radio, Typography} from 'antd'

import './ListPage.css'
import Meta from 'antd/lib/card/Meta';
import axios from 'axios'
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'

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
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post(`/api/contest/getContests/?limit=${Limit}&offset=${Skip}`, variables,config)
        .then(response => {
            console.log(3)
            if(response.data.success){
                if(Skip !== 0){
                    setContests([...Contests, ...response.data.contests])
                }else {
                    setContests(response.data.contests)
                }
            }else{
                console.log(response.data.err)
            }
        })
    }

    console.log(Contests)

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
                    <div className="event-item-img"><img style={{width:'100%', height:'100%'}} src={convertToS3EP(contest.banner)} alt/></div>
                    <div className="event-item-content">
                        <h1>{contest.title}</h1>
                        <h2>{contest.description}</h2>
                    </div>
                </div>
            </a>
        </div>
    )

    return (
        <div style={{width:'100vw', height:'100vh', backgroundColor:'#F9F8FD'}}>
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
                {Contests && Contests.map(contest => renderContest(contest))}
            </div>
        </div>
        </div>
    );
}

export default EventListPage;