import React, { useState, useEffect } from 'react';
import {Card, Button, Col, Row} from 'antd'

import {firstImg} from './imagePaths'
import VoteDetailPage from '../../DetailPage/VoteDetailPage'

const {Meta} = Card

function VoteBox(props) {
    const [DetailVisible, setDetailVisible] = useState(false)
    const [Contents, setContents] = useState([])
    useEffect(() => {
        
    }, [DetailVisible])

    const showDetail = () => {
        console.log("true")
        setDetailVisible(true)
    }

    const hideDetail = () => {
        console.log("false")
        setDetailVisible(false)
    }
    
    const renderCards = () => {
        return (
            <Col className="item-vote" lg={8} md={12} xd={24}>
                <img className="item-vote-img" src={firstImg} alt/>
                <div className="item-vote-show">
                    <a id="go-detail" onClick={showDetail}>자세히보기</a>
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
                    {renderCards()}
                    {renderCards()}
                    {renderCards()}
                    {renderCards()}
                    {renderCards()}
                    {renderCards()}
                </Row>
            </div>
        </div>
        {DetailVisible && 
        <div className="layer">
            <div className="dimBg" onClick={hideDetail}></div>
            <div id="detail-layer" className="pop-layer">
                <div className="pop-container">
                    <div className="pop-contents">
                        <VoteDetailPage/>
                    </div>
                </div>
            </div>
        </div>}
        </>
    );
}

export default VoteBox;