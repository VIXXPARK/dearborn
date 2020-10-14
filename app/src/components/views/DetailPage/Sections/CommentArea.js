import React, { useState, useEffect } from 'react';
import {Input, Avatar, Button} from 'antd';
import axios from 'axios';

import './CommentArea.css'

const {TextArea} = Input
function CommentArea(props) {

    const [CommentValue, setCommentValue] = useState("")
    const [Comments, setComments] = useState([])

    useEffect(() => {
        axios.post('/api/comment/getComment', {postId : props.postId})
        .then(response => {
            if(response.data.success){
                console.log(response.data.comments)
                setComments(response.data.comments)
            }else{
                alert('댓글 가져오기 실패')
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
        axios.post('/api/comment/upComment', data)
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
                alert('실패')
            }
        })
        setCommentValue("")
    }

    console.log(Comments)

    const renderingComments = (comment) => {
        const ChangeComment = () =>{
            
        }
        const DeleteComment = () => {
            axios.post('/api/comment/delComment', {commentId : comment.id})
            .then(response => {
                console.log(response.data)
                if(response.data.success){
                    alert('성공')
                    const deleteIndex = Comments.indexOf(comment)
                    setComments(Comments.slice(0, deleteIndex).concat(Comments.slice(deleteIndex+1, Comments.length)))
                }else{
                    alert('실패')
                }
            })
        }
        return (
            <div className="comment-form">
                <div className="comment-nickname">
                    <Avatar src={`http://localhost:8000${comment.profileImage}`}/>
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
            <div>
                {Comments && Comments.map((comment)=>(
                    renderingComments(comment)
                ))}
            </div>
            {/*{props.userId &&*/}
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <Avatar src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}/>
                <TextArea
                    style={{width:'100%', borderRadius:'5px'}}
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