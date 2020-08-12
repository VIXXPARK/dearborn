import React, { useState, useEffect } from 'react';
import './VoteDetailPage.css'
import Modal from '../../utils/Modal'

function VoteDetailPage(props) {

    const [Contents, setContents] = useState([])

    const params = new URLSearchParams(props.location.search)

    const RenderContents = /*Contents ?*/
    (
    <div style={{color:'black'}}>
        <div className="detail-header">
            제목
        </div>
        <div className="detail-span">
            작성자 일자
        </div>
        <div className="detail-content">
            이미지 내용
        </div>
    </div>
    )
    /*: <div className="detail-empty">글이 없습니다.</div>*/
    

    return (
        params.get('designer') && (
        <Modal
            onClick={()=>{
                props.history.go(-1)
            }}
        >
            {RenderContents}
        </Modal>
        )
    );
}

export default VoteDetailPage;