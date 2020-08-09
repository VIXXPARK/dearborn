import React, { useState, useEffect } from 'react';
import Modal from '../../utils/Modal'
import './VoteDetailPage.css'

function VoteDetailPage(props) {
    
    let params = new URLSearchParams(props.location.search)

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
        params.get('designer') && (
            <Modal
                onClick={() => {
                    props.history.push(props.location.pathname)
                }}
            >
                <div
                    style={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:"center",
                        height:'100%'
                    }}
                >
                    {RenderContents}
                </div>
            </Modal>
        )
    );
}

export default VoteDetailPage;