import React, { useState, useEffect } from 'react';
import './Sections/Repo.css'
import {firstImg} from './Sections/imagePaths'
import { Card, Avatar } from 'antd'
import axios from 'axios'

const { Meta } = Card

function LandingPageRepo(props) {

    const [Posts, setPosts] = useState([])

    useEffect(() => {
        axios.get('/api/post/getPosts') //나중에 Repo로 바꿔야됨
        .then(response =>{
            if(response.data.success){
                setPosts(response.data.posts)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const renderItems = (post)=>{
        return (
        <Card
            className="item"
            hoverable={false}
            cover={<a href={`/${post.writer.nickname}/${post._id}`}><img src={`http://localhost:5000/${post.images[0]}`} alt/></a>}
        >
            <Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                title={post.title}
                description={<a href={`/${post.writer.nickname}`}>{post.writer.nickname}</a>}
            />
        </Card>
        )
    }

    return (
        <div style={{width:'80%', margin: '3rem auto', backgroundColor:'powderblue'}}> 
            <div style={{textAlign:'center'}}>
                <h1>Welcome to DEarborn</h1>
            </div>
            <div className="items">
                <div style={{marginTop: '7px'}}>
                    {Posts.map((post) => (
                        renderItems(post)
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LandingPageRepo;