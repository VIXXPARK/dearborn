import axios from 'axios';
import React, { useEffect, useState } from 'react';

import banner_rank from '../../assets/banner_rank.png'
import { convertToS3EP } from '../../utils/String';
import {getCookieValue} from '../../utils/Cookie'

function RankPage(props) {
    const [Ranks, setRanks] = useState([])

    useEffect(() => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.get('/api/post/getVotes/user/', config)
        .then(response => {
            console.log(response)
            if(response.status === 200){
                setRanks(response.data)
            }else{
                console.log("User 가져오기 실패")
            }
        })
    }, [])
    console.log(Ranks)
    const renderRank = (rank) => {

        return (
            <div style={{width:'1000px', margin:'0 auto',paddingTop:'30px',paddingBottom:'30px', borderBottom:'1px solid #d9d9d9'}}>
                <div style={{display:'inline-block', width:'150px', height:'150px', borderRadius:'150px', overflow:'hidden'}}>
                    <img style={{width:'100%'}} src={convertToS3EP(rank.user.profileImage)}/>
                </div>
                <div style={{display:'inline-block', width:'200px', height:'125px',margin:'12.5px', verticalAlign:'top'}}>
                    <div >
                        {rank.user.writer}
                    </div>
                    <div>
                        {rank.user.content}
                    </div>
                    <button style={{width:'100%', textAlign:'center'}} onClick={()=>props.history.push(`/${rank.user.writer}`)}>작가 블로그</button>
                </div>
                <div style={{display:'inline-block', width:'550px',height:'125px', margin:'12.5px', verticalAlign:'top'}}>
                    
                    {rank.post.map(post => (
                        <div style={{display:'inline-block', width:'125px', height:'125px', marginLeft:'10px',borderRadius:'10px', overflow:'hidden'}}>
                            <img style={{width:'100%'}} src={convertToS3EP(post.thumbnail)}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


    return (
        <div>
            <div style={{position:'relative', width:'100%', height:'400px'}}>
                <img style={{width:'100%', height:'100%', opacity:'0.6'}} src={banner_rank}/>
                <div style={{position:'absolute', top:'180px', left:'calc( 50% - 125px)', margin:'0 auto', fontSize:'50px', color:'white'}}>작가 순위</div>
            </div>
            <div style={{width:'100%', height:'400px', maxWidth:'1400px', margin:'0 auto'}}>
                {Ranks && Ranks.map((rank) => (
                    renderRank(rank)
                ))}
            </div>
        </div>
    );
}

export default RankPage;