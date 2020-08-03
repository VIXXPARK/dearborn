import React, { useState, useEffect } from 'react';
import {Modal} from 'antd'
import './VoteDetailPage.css'

function VoteDetailPage(props) {
    
    const [Contents, setContents] = useState([])

    const RenderContents = /*Contents ?*/
    (
        
    <>
        <div className="detail-header">
            제목
        </div>
        <div className="detail-span">
            작성자 일자
        </div>
        <div className="detail-content">
            이미지 내용
        </div>
    </>)
    /*: <div className="detail-empty">글이 없습니다.</div>*/
    

    return (
        <div className="container-detail">
            {RenderContents}
        </div>
    );
}

export default VoteDetailPage;