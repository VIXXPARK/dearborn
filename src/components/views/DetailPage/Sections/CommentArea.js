import React, { useState, useEffect } from 'react';
import {Input, Avatar, Button} from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

import './CommentArea.css'
import { convertToS3EP } from '../../../utils/String';
import {getCookieValue} from '../../../utils/Cookie'

const {TextArea} = Input
function CommentArea(props) {

    const [CommentValue, setCommentValue] = useState("")
    const [Comments, setComments] = useState([])

    const user = useSelector(state => state.user)

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/comment/getComment', {postId : props.postId}, config)
        .then(response => {
            if(response.data.success){
                console.log(response.data.comments)
                setComments(response.data.comments)
            }else{
                console.log(response.data.err)
            }
        })
    }, [])

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e)=>{
        e.preventDefault()
        
        const data = {
            contents : CommentValue,
            user : window.localStorage.getItem('userId'),
            post : props.postId
        }
        console.log(data)
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.post('/api/comment/upComment', data, config)
        .then(response => {
            if(response.data.success){
                console.log(Comments)
                const variable = {
                    contents : data.contents,
                    user : data.user,
                    post : data.post,
                    id : response.data.id,
                    nickname : response.data.user.nickname,
                    profileImage : response.data.user.profileImage,
                }
                setComments(Comments.concat(variable))
                alert('성공')
            }else{
                console.log(response.data.err)
            }
        })
        setCommentValue("")
    }

    console.log(Comments)

    const renderingComments = (comment) => {
        const ChangeComment = () =>{
            
        }
        const DeleteComment = () => {
            const config = {
                headers : {
                    Authorization: `Token ${getCookieValue('w_auth')}`
                }
            }
            axios.post('/api/comment/delComment', {commentId : comment.id}, config)
            .then(response => {
                console.log(response.data)
                if(response.data.success){
                    alert('성공')
                    const deleteIndex = Comments.indexOf(comment)
                    setComments(Comments.slice(0, deleteIndex).concat(Comments.slice(deleteIndex+1, Comments.length)))
                }else{
                    console.log(response.data.err)
                }
            })
        }
        return (
            <div className="comment-form">
                <div className="comment-nickname">
                    <Avatar src={user.userData && convertToS3EP(user.userData.profileImage)}/>
                    {comment.nickname}
                </div>
                <p className="comment-content">{comment.contents}</p>
                <div className="comment-action">
                    <p style={{fontSize : '15px'}}><a onClick={ChangeComment}>수정</a> <a onClick={DeleteComment}>삭제</a></p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div style={{borderBottom: '1px solid black', marginBottom:'10px'}}>
                댓글
            </div>
            <div>
                {Comments && Comments.map((comment)=>(
                    renderingComments(comment)
                ))}
            </div>
            {/*{props.userId &&*/}
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <Avatar style={{marginRight:'10px'}} size={35} src={user.userData && user.userData.profileImage ? convertToS3EP(user.userData.profileImage) : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&usqp=CAU"}/>
                <TextArea
                    style={{width:'100%', borderRadius:'5px', marginBottom:'1rem'}}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="write comments"
                />
                <Button style={{width:'20%', height:'52px'}} onClick={onSubmit}>제출</Button>
            </form>{/* } */}
        </div>
    );
}

export default CommentArea;