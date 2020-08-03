import React, { useState, useEffect } from 'react';
import axios from 'axios'

import RankBox from './Sections/RankBox'
import VoteBox from './Sections/VoteBox'
import './Sections/Vote.css'
function LandingPageVote(props) {

    useEffect(() => {
        axios.get('/profile')
        .then(response => {
            console.log(response)
        })
    }, [])

    return (
        <>
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div className="rank">
                <RankBox />
            </div>
            <div className="vote">
                <VoteBox />
            </div>
        </div>
        
        </>
    );
}

export default LandingPageVote;