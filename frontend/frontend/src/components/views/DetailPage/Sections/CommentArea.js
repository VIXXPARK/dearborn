import React, { useState, useEffect } from 'react';
import {Input, Avatar, Button, Comment} from 'antd';
import axios from 'axios';

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
        console.log(CommentValue)
        
        const variables = {
            content : Comment,
            userId : props.userId,
            postId : props.postId
        }
        
        axios.post('/api/comment/upComment', variables)
        .then(response => {
            if(response.data.success){
                setComments(...Comments, ...response.data.comment)
                alert('성공')
            }else{
                alert('실패')
            }
        })

    }

    const renderingComments = (comment) => {
        
        return (
            <Comment 
                author={comment.userId.nickname}
                avatar={<Avatar
                            src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                        />}
                content={<p>{comment.content}</p>}
            />
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