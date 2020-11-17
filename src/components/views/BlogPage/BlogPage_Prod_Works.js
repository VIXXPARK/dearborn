import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios'
import { Button, Typography, Card, Avatar, Modal, Tooltip } from 'antd';
import {config} from '../../utils/Token'
import './BlogPage.css'
import Meta from 'antd/lib/card/Meta';
import {convertToS3EP} from '../../utils/String'
import {getCookieValue} from '../../utils/Cookie'
import {EyeOutlined, CheckCircleOutlined, LikeOutlined} from '@ant-design/icons'
import {Loader} from '../../utils/Loader'
import { Link } from 'react-router-dom';

const {Title} = Typography
const {confirm} = Modal

function BlogPage_Prod_Works(props) {

    const [Repos, setRepos] = useState([])
    const [Designer, setDesigner] = useState("")
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(7)
    const [LoadMore, setLoadMore] = useState(true)
    const [IsBottom, setIsBottom] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [PostColumn, setPostColumn] = useState(7)
    const [WindowX, setWindowX] = useState(0)

    const designer = props.match.params.designer

    useLayoutEffect(() => {
        function updateSize(){
            setWindowX(window.innerWidth)
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/info/getProfile', {nickname:designer}, config)
        .then(response => {
            if(response.data.success){
                if(response.data.user.job === 2)
                    props.history.push(`/${designer}/cons`)
                setDesigner(response.data.user)
                getPosts(response.data.user.id)
            }else{
                console.log(response.data.err)
            }
        })
        window.addEventListener('scroll', handleScroll)
        return ()=> window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if(window.innerWidth < 400){
            setPostColumn(1)
        }
        else if(window.innerWidth <700)
        {
            setPostColumn(2)
        }
        else if(window.innerWidth <1000){
            setPostColumn(3)
        }
        else if(window.innerWidth <1300){
            setPostColumn(4)
        }
        else if(window.innerWidth >=1300){
            setPostColumn(5)
        }
    }, [window.innerWidth])

    useEffect(() => {
        setTimeout(() => {
            let images = document.querySelectorAll('.item-vote-wrap')
            let imgStack
            if(PostColumn === 1){
                imgStack = [0]
            }else if(PostColumn === 2){
                imgStack =[0,0]
            }
            else if(PostColumn === 3){
                imgStack =[0,0,0]
            }
            else if(PostColumn === 4){
                imgStack =[0,0,0,0]
            }
            else if(PostColumn === 5){
                imgStack =[0,0,0,0,0]
            }
            let colWidth = 256;
            for(let i=0; i<images.length; i++){
                let minIndex = imgStack.indexOf(Math.min.apply(0, imgStack))
                let x = colWidth * minIndex
                let y = imgStack[minIndex]
                imgStack[minIndex] += (images[i].children[0].height + 65)
                images[i].style.transform = `translateX(${x}px) translateY(${y}px)`
            }
        }, 500);

    }, [document.querySelectorAll('.item-vote-wrap'), PostColumn])

    useEffect(() => {
        if(IsBottom && LoadMore && !Loading){
            setLoading(true)
            getPosts(Designer.id)
            setIsBottom(false)
        }
    }, [IsBottom])
    console.log(Repos)
    const handleScroll = () => {
        const scrollTop= (document.documentElement 
            && document.documentElement.scrollTop)
            || document.body.scrollTop
        const scrollHeight= (document.documentElement 
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;
        if(scrollTop + window.innerHeight >= scrollHeight){
            setIsBottom(true)
        }else{
            setIsBottom(false)
        }
    }

    const getPosts = (id) => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post(`/api/info/getWorks/?limit=${Limit}&offset=${Skip}`, {id : id}, config)
                .then(response => {
                    if(response.data.success){
                        if(response.data.repos.length < Limit)
                            setLoadMore(false)
                        if(Skip !==0){
                            setRepos([...Repos, ...response.data.repos])
                        }else{
                            setRepos(response.data.repos)
                        }
                        setSkip(Skip+Limit)
                    }else{
                        console.log(response.data.err)
                    }
                }).finally(()=>{
                    setLoading(false)
                })
    }

    const renderLikes = (post) => {
        const onMyWorkPick = ()=>{
            confirm({
                icon : null,
                content: <p>대표작품으로 지정하시겠습니까?</p>,
                onOk(){
                    const config = {
                        headers : {
                            Authorization: `Token ${getCookieValue('w_auth')}`
                        }
                    }
                    axios.post('/api/info/setMyWork', {post : post.id}, config)
                    .then(response => {
                        if(!response.data.success)
                            alert('실패')
                        else
                            alert('대표작품 지정 완료')
                    })
                },

            })
        }
        return (
            <div className="item-vote-wrap">
                <img className="item-vote-img" src={convertToS3EP(post.thumbnail)} alt/>
                <div className="item-vote-obv"></div>
                    <div className="item-vote-show">
                    <div style={{position:'absolute',top:'60px', right:'10%',fontSize:'30px', textAlign:'center', margin:'0 auto', color:'#f85272'}}><Tooltip placement="topLeft" title="대표작품 지정"><CheckCircleOutlined onClick={onMyWorkPick}/></Tooltip></div>
                    <Link to = {{pathname:'/', search: `designer=${post ? post.writer : null}&postId=${post ? post.id : null}`}}>
                        <div className="item-vote-title">
                            {post.title}
                        </div>
                        <div className="item-vote-rate">
                            <div style={{display:'inline-block'}}>({post.score} 3.6 / 5점)</div>
                        </div>
                        </Link>
                    </div>
                <div style={{width:'100%', height:'50px'}}>
                    <div style={{float:'right',width:'40px', fontSize:'10px', lineHeight:'50px', paddingTop:'3px'}}>{post.view}</div>
                    <div style={{float:'right', fontSize:'20px', verticalAlign:'middle', lineHeight:'50px', paddingTop:'5px', marginRight:'5px'}}>
                        <EyeOutlined />
                    </div>
                    <div style={{float:'right',width:'40px', fontSize:'10px', lineHeight:'50px', paddingTop:'3px'}}>{post.like}</div>
                    <div style={{float:'right', fontSize:'20px', verticalAlign:'middle', lineHeight:'50px', paddingTop:'5px', marginRight:'5px'}}>
                        <LikeOutlined />
                    </div>
                </div>
            </div>
            )
    }

    return (
        <div className="blog-container">
            <div className="blog-right-container">
                {/* <img src= {`http://localhost:5000/${}`}/> */}
                <div className="blog-header">
                    <div style={{width:'200px', height:'200px',float:'left'}}>
                        <img style={{display:'inline-block', verticalAlign:'top', width:'100%', height:'100%', background:'rgba(0,0,0, 0.05)', borderRadius:'100px'}} src={Designer && Designer.profileImage[0] ? convertToS3EP(Designer.profileImage[0]) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                    </div>
                    <div className="blog-header-content">
                        <Title>{Designer.nickname}</Title>
                        <p id="blog-header-p1">{Designer.content}</p>
                        <p id="blog-header-p2">{Designer.job===1 ? "디자이너" : "클라이언트"}</p>
                        <p>Works : {Designer.work}개</p>
                        <p>Likes : {Designer.like}개</p>
                        <p>Views : {Designer.view}개</p>
                    </div>
                </div>
                <div className="blog-section">
                    <a href={`/${designer}`}><button className="blog-tabs-btn">대표작</button></a>
                    <button className="blog-tabs-btn" id="blog-tabs-clicked">작품</button>
                    <a href={`/${designer}/likes`}><button className="blog-tabs-btn">좋아요</button></a>
                    <div className="blog-tabs-content">
                    <div className="prod-works">
                            {Repos && Repos.map(repo => renderLikes(repo))}
                        </div>
                    </div>
                </div>
            </div>
            {Loading && Loader("spin", "black")}
        </div>
    );
}

export default BlogPage_Prod_Works;