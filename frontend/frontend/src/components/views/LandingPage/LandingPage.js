import React, { useState, useEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import './Sections/Vote.css'
import './Sections/Repo.css'
import { Row, Card, Avatar } from 'antd';
import {Link} from 'react-router-dom'

import RepoLogo from '../../assets/RepoLogo.png'
import VoteLogo from '../../assets/VoteLogo.png'
import ShowMore from '../../assets/ShowMore.png'

import {ArrowRightOutlined} from '@ant-design/icons'

const {Meta} = Card

function LandingPage(props) {


    const [RepoPosts, setRepoPosts] = useState([])
    const [VotePosts, setVotePosts] = useState([])
    const [Voted, setVoted] = useState([])

    console.log(RepoPosts)
    useEffect(() => {
        axios.get('/api/post/getVotes/?limit=4&offset=0')
        .then(response => {
            if(response.data.success){
                setVotePosts(response.data.votes)
            }
        })
        axios.get('/api/post/getRepos/?limit=4&offset=0')
        .then(response => {
            if(response.data.success){
                setRepoPosts(response.data.repos)
            }
        })
        if(window.localStorage.getItem('userId')){
        axios.post('/api/vote/myVote', {user : window.localStorage.getItem('userId')})
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                let variable = response.data.posts
                setVoted(variable)
            }else{
                alert('투표정보 가져오기 실패')
            }
        })}
    }, [])

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
        <>
        <div style={{width:'95%', margin:'3rem auto'}}>
            <div className="rank">
                <label style={{fontSize:'30px', textAlign:'left'}}>지난 주 랭킹</label>
                <RankBox />
            </div>
            <div className="vote">
                <div style={{margin: '3rem auto'}}> 
                    <div style={{textAlign:'center',}}>
                        <img className="type-logo" src={VoteLogo}/>
                    </div>
                    <div className="container-vote-section">
                        {VotePosts.map((post) => (
                            renderVoteItems(post)
                        ))}
                    </div>
                    <img className="show-more-img" onClick={()=>props.history.push('/vote')} src={ShowMore}/>
                </div>
            </div>
            <div style={{margin: '3rem auto'}}> 
                <div style={{textAlign:'center'}}>
                    <img className="type-logo" src={RepoLogo}/>
                </div>
                <div className="items">
                    <div style={{marginTop: '7px'}}>
                        {RepoPosts && RepoPosts.map((post) => (
                            renderRepoItems(post)
                        ))}
                    </div>
                </div>
                <img className="show-more-img" onClick={()=>props.history.push('/repo')} src={ShowMore}/>
            </div>
        </div>
        </>
    );
}

export default LandingPage;