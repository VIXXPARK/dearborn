import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar } from 'antd';

import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';

const {Title} = Typography

function BlogPage(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")

    const designer = props.match.params.designer

    useEffect(() => {
        axios.post('/api/post/getProfile', {nickname:designer})
        .then(response => {
            if(response.data.success){
                setRepos(response.data.repos)
                setDesigner(response.data.user)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    const renderPost = (repo) => {
        return (
            <Card
                className="item"
                cover={<a href={`/${Designer.nickname}/${repo.id}`}><img src={`http://localhost:8000${repo.images[0]}`} alt/></a>}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={repo.title}
                    description={repo.content}
                />
            </Card>
            )
    }

    return (
        <div className="blog-container">
            {/* <img src= {`http://localhost:5000/${}`}/> */}
            <div className="blog-header">
                <Title>{Designer.nickname}</Title>
            </div>
            <div className="blog-follow">
                <Button>follow</Button>
            </div>
            <div className="blog-section">
                {Repos && Repos.map((repo)=>(
                    renderPost(repo)
                ))}
            </div>
        </div>
    );
}

export default BlogPage;