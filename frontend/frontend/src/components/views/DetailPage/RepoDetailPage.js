import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography, Button} from 'antd'

import './RepoDetailPage.css'

const {Title} = Typography

function RepoDetailPage(props) {

    const [Writer, setWriter] = useState("")
    const [Repo, setRepo] = useState("")
    const postId = props.match.params.postId
    useEffect(() => {
        axios.post('/api/post/getPostDetail', {postId : postId, siteType : 0})
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setRepo(response.data.detailPost[0])
                setWriter(response.data.detailPost[0].writer)
            }else{
                alert('데이터 가져오기 실패')
            }
        })
    }, [])

    return (
        <div className="repo-container">
            <div className="repo-title">
                <Title>{Repo.title}</Title>
            </div>
            <div className="repo-span">
                {Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""}
            </div>
            <div className="repo-content">
                {Repo.images && Repo.images.map((image, i) => (
                    <div>
                        <img key={i} src={`http://localhost:5000/${image}`} style={{width:'100%'}} />
                    </div>
                ))}
                <br/><br/>
                <div className="repo-content-detail">
                    {Repo.content}
                </div>
                <br/><br/>
            </div>
            <div className="repo-profile">
                <div className="repo-profile-header">
                    {Writer.nickname}
                </div>
                <div className="repo-profile-content">
                    {Writer.content}
                </div>
                <br/>
                <div className="repo-profile-button">
                    <a href={`/${Writer.nickname}`}><Button>블로그로 가기</Button></a>
                </div>
            </div>
        </div>
    );
}

export default RepoDetailPage;