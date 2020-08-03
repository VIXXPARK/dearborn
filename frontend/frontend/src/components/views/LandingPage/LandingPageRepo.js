import React, { useState } from 'react';
import './Sections/Repo.css'
import {firstImg} from './Sections/imagePaths'
import { Card } from 'antd'

const { Meta } = Card

function LandingPageRepo(props) {

    const [Photos, setPhotos] = useState([])

    const renderItems = ()=>{
        return (
        <Card
            className="item"
            hoverable={true}
            cover={<a href><img src={firstImg} alt/></a>}
        >
            <Meta
                title={"제목"}
                description={"설명"}
            />
        </Card>
        )
    }

    return (
        <div style={{width:'80%', margin: '3rem auto', backgroundColor:'powderblue'}}> 
            <div style={{textAlign:'center'}}>
                <h1>Welcome to DEarborn</h1>
            </div>
            <div className="items">
                <div style={{marginTop: '7px'}}>
                    {renderItems()}
                    {renderItems()}
                    {renderItems()}
                    {renderItems()}
                    {renderItems()}
                    {renderItems()}
                </div>
            </div>
        </div>
    );
}

export default LandingPageRepo;