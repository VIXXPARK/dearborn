import React, { useEffect, useState } from 'react';
import {Avatar} from 'antd';
import {convertToS3EP} from '../../../utils/String'
import banner1 from '../../../assets/banner1.PNG'
import banner2 from '../../../assets/banner2.PNG'
import banner3 from '../../../assets/banner3.PNG'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'

function PostRankBox(props) {
    const [RankIndex, setRankIndex] = useState(0)
    const [RankPosts, setRankPosts] = useState([{
        banner : banner1
    },{
        banner : banner2
    },{
        banner : banner3
    }])
    
    const ShowLeftIndex = () =>{
        if(RankIndex===0){
            setRankIndex(2)
        }else{
            setRankIndex(RankIndex-1)
        }
    }

    const ShowRightIndex = () =>{
        if(RankIndex===2){
            setRankIndex(0)
        }else{
            setRankIndex(RankIndex+1)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if(RankIndex===2){
                setRankIndex(0)
            }else{
                setRankIndex(RankIndex+1)
            }
        }, 7000);
    }, [RankIndex])

    return (
        <div className="post-rank-container">
            {RankPosts && RankPosts.map((post, i) => (
                <>
                <div style={{position:'relative',transition:'transform 1s', transform:`translate(calc(-100% * ${RankIndex}), 0)`}} className="post-rank-item">
                    <div style={{display:'inline-block', width:'100%', height:'50vw', maxHeight:'450px'}}>
                        <img style={{width:'100%', height:'100%'}} src={post.banner}/>
                    </div>
                </div>
                </>
            ))
            }
        </div>
    );
}

export default PostRankBox;