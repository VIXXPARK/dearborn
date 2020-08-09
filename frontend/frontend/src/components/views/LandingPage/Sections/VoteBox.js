import React, { useState, useEffect } from 'react';
import {Card, Button, Col, Row} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'

import {firstImg} from './imagePaths'
import VoteDetailPage from '../../DetailPage/VoteDetailPage'

const {Meta} = Card

function VoteBox(props) {
    const [DetailVisible, setDetailVisible] = useState(false)
    const [Products, setProducts] = useState([])
    useEffect(() => {
        axios.get('/api/product/getProducts')
        .then(response => {
            if(response.data.success){
                setProducts(response.data.products)
            }
        })
    }, [DetailVisible])
    
    const renderCards = (post) => {
        console.log(post)
        return (
            <Col className="item-vote" lg={8} md={12} xd={24}>
                <img className="item-vote-img" src={`http://localhost:5000/${post.images[0]}`} alt/>
                <div className="item-vote-show">
                    <div id="go-detail" >
                        <Link to = {{pathname: "/detail/", search: `?designer=${post.writer}`}}>자세히보기</Link>
                    </div>
                    <Button id="button-vote">투표하기</Button>
                </div>
            </Col>
        )
    }
    
    return (
        <>
        <div className="container-vote">
            <div className="container-vote-header">
                Let's Vote!!
            </div>
            <div className="container-vote-section">
                <Row gutter={[16,16]}>
                    {Products.map(post => (
                        renderCards(post)
                    ))}
                </Row>
            </div>
        </div>
        </>
    );
}

export default VoteBox;