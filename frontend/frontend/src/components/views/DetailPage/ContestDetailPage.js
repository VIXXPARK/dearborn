import React from 'react';
import {Typography} from 'antd'


const {Title} = Typography

function ContestDetailPage(props) {
    return (
        <div className="repo-container">
            <div className="repo-left-container">
                <div className="repo-content">
                    <div style={{border:'1px solid black', borderRadius:'20px'}}>
                        <br/><br/>
                        <div style={{borderBottom:'1px solid black'}}>
                            <Title>Title</Title>
                        </div>
                        <img src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} style={{width:'100%'}} />
                        <p style={{marginTop:'50px', textAlign:'left'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id nibh tristique, blandit lorem et, aliquet nunc. Curabitur venenatis porttitor lorem sit amet fringilla. Sed at maximus ipsum, vitae volutpat lacus. Fusce nec risus semper, ultrices libero nec, bibendum tortor. Phasellus non diam non nisi semper lobortis ut vitae tortor. Nunc vitae lacus sit amet nisi malesuada dictum sit amet sed nunc. Aliquam ac viverra dolor, nec consectetur tortor. Mauris augue urna, euismod ut arcu vitae, mattis bibendum purus. Nunc eu est a lorem accumsan fermentum nec et arcu.

Morbi quis ornare diam. Mauris fringilla, libero vel efficitur eleifend, sem diam finibus augue, id rhoncus odio odio at neque. Vestibulum vestibulum sodales vehicula. Duis nunc velit, condimentum sed ipsum in, ultricies aliquam libero. Nulla a facilisis leo, vitae malesuada enim. Nullam eu sapien ut sem auctor condimentum. Quisque aliquam elit ligula, ac dapibus ex imperdiet lobortis. Pellentesque ut ligula quis nulla blandit dignissim sit amet vulputate ligula. Integer turpis arcu, fringilla eu cursus placerat, vehicula ac diam. Donec a congue augue. Sed quis mattis ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas malesuada erat in orci venenatis, interdum cursus nunc faucibus. Phasellus vel vulputate turpis.</p>
                    </div>
                    <br/><br/>
                </div>
            </div>
            <div className="repo-right-container">
                <div className="repo-right-detail">
                    <div className="repo-title">
                        <Title>개최자 정보</Title>
                    </div>
                    <div className="repo-span">
                        이름
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <div className="repo-span">
                        소개
                        {/*Repo ? Repo.updatedAt.slice(0,10) +" " + Repo.updatedAt.slice(11,19): ""*/}
                    </div>
                    <div className="event-right-button">
                        블로그 가기
                    </div>
                    <br/>
                </div>
                <div className="event-bid-button">
                    공모전 참여하기
                </div>
            </div>
            
        </div>
    );
}

export default ContestDetailPage;