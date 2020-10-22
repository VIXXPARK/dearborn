import React, { useState, useEffect } from 'react';

import { List, Skeleton, Button, Avatar } from 'antd';

function RankBox(props) {
    const [List, setList] = useState([
        {nickname:'pazbear1'},
        {nickname:'pazbear2'},
        {nickname:'pazbear3'},
    ])
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        
    }, [])

        return (
        <div className="rank-container">
            {List && List.map(item => (
                <div className="rank-item">
                    <div className="rank-img">
                        <img style={{width:'100%', height:'100%', borderRadius:'30px'}} src={"https://t1.daumcdn.net/cfile/tistory/994BEF355CD0313D05"}/>
                    </div>
                    <div className="rank-content">
                        {item.nickname}
                    </div>
                </div>
            ))}
        </div>
        )
}

export default RankBox;