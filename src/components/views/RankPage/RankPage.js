import React from 'react';

import banner_rank from '../../assets/banner_rank.png'

function RankPage(props) {



    const renderRank = (user) => {

        return (
            <div>

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
                {renderRank()}
            </div>
        </div>
    );
}

export default RankPage;