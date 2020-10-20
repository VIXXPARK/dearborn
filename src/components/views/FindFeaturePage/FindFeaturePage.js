import { Menu } from 'antd';
import React, { useState } from 'react';
import {LoadingOutlined, RightSquareOutlined} from '@ant-design/icons'

import './FindFeaturePage.css'
const {SubMenu} = Menu

function FindFeaturePage(props) {
    const [CurrentStep, setCurrentStep] = useState(1)
    const [Modal, setModal] = useState(false)
    const [Preview, setPreview] = useState(undefined)
    const [Loading, setLoading] = useState(false)
    const handleCategoryClick = (e) => {
        console.log(e)
    }

    const OnNextClick = () =>{
        setLoading(true)
        setTimeout(function(){
            setCurrentStep(CurrentStep+1)
            setLoading(false)
        }, 2000);
    }

    const OnModalClose = () => {
        setModal(false)
    }

    const OnModalOpen = () => {
        setModal(true)
        setPreview(1)
        console.log(1)
    }
    return (
        <div className="feature-container">
            <div className="feature-wrapper">
                <div className="feature-step1" id={CurrentStep === 1 ? "step-on" : "step-off"}>
                    <div className="feature-title1">
                        <h1>STEP 1: 카테고리 설정</h1>
                    </div>
                    <Menu
                        onClick={handleCategoryClick}
                        style={{border:"1px solid black",width:400, height:'300px',overflowX:'hidden', overflowY:'scroll'}}
                        defaultOpenKeys={['clothes','accessory','shoes']}
                        mode="inline"
                    >
                        <SubMenu
                            disabled
                            key="clothes"
                            title={
                                <span>의류</span>
                            }
                        >
                            <Menu.ItemGroup>
                                <Menu.Item key={1}>상의</Menu.Item>
                                <Menu.Item key={2}>하의</Menu.Item>
                                <Menu.Item key={3}>모자</Menu.Item>
                                <Menu.Item key={4}>아우터</Menu.Item>
                                <Menu.Item key={5}>속옷</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <SubMenu
                            disabled
                            key="accessory"
                            title={
                                <span>악세서리</span>
                            }
                        >
                            <Menu.ItemGroup>
                                <Menu.Item key={6}>귀걸이</Menu.Item>
                                <Menu.Item key={7}>시계</Menu.Item>
                                <Menu.Item key={8}>목걸이</Menu.Item>
                                <Menu.Item key={9}>팔찌</Menu.Item>
                                <Menu.Item key={10}>발찌</Menu.Item>
                                <Menu.Item key={11}>발찌</Menu.Item>
                                <Menu.Item key={12}>반지</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <SubMenu
                            disabled
                            key="shoes"
                            title={
                                <span>신발</span>
                            }
                        >
                            <Menu.ItemGroup>
                                <Menu.Item key={13}>단화</Menu.Item>
                                <Menu.Item key={14}>스포츠</Menu.Item>
                                <Menu.Item key={15}>슬리퍼</Menu.Item>
                                <Menu.Item key={16}>샌들</Menu.Item>
                                <Menu.Item key={17}>하이힐</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    <div className="next-btn-wrapper">
                        <button className="next-btn" onClick={OnNextClick}>{!Loading ? "다음 STEP" : <LoadingOutlined />}</button>
                    </div>
                </div>
                <div className="feature-step2" id={CurrentStep === 2 ? "step-on" : "step-off"}>
                    <div className="feature-title2">
                        <span style={{textAlign:'left',marginLeft:'10px', fontSize:'30px', fontWeight:'bold'}}>STEP 2:<br/> 데이터<br/> 추리기</span>
                    </div>
                    <div className="post-list-show-container">
                        <div className="post-list-show-wrapper">
                            <div className="post-list-show-item" onClick={OnModalOpen}>
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                        </div>
                    </div>
                    <div className="next-btn-wrapper">
                        <button className="next-btn" onClick={OnNextClick}>{!Loading ? "다음 STEP" : <LoadingOutlined />}</button>
                    </div>
                </div>
                <div className="feature-step3" id={CurrentStep === 3 ? "step-on" : "step-off"}>
                    <div className="feature-title2">
                        <span style={{textAlign:'left',marginLeft:'10px', fontSize:'30px', fontWeight:'bold'}}>STEP 3:<br/> 원하는<br/> 포스트 선택</span>
                    </div>
                    <div className="post-list-show-container">
                        <div className="post-list-show-wrapper">
                            <div className="post-list-show-item" onClick={OnModalOpen}>
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="post-list-show-item">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                        </div>
                    </div>
                    <div className="next-btn-wrapper">
                        <button className="next-btn" onClick={OnNextClick}>{!Loading ? "다음 STEP" : <LoadingOutlined />}</button>
                    </div>
                </div>
                <div className="feature-step4" id={CurrentStep === 4 ? "step-on" : "step-off"}>
                    <div className="feature-title">
                        <h1>STEP 4: 카테고리 설정</h1>
                    </div>
                    <div className="feature-result-container">
                        <div className="feature-result-item">
                            <div className="feature-result-item-thumb">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="feature-result-item-title">
                                타이틀
                            </div>
                            <div className="feature-result-item-btn">
                                <RightSquareOutlined/>
                            </div>
                        </div>
                        <div className="feature-result-item">
                            <div className="feature-result-item-thumb">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="feature-result-item-title">
                                타이틀
                            </div>
                            <div className="feature-result-item-btn">
                                <RightSquareOutlined/>
                            </div>
                        </div>
                        <div className="feature-result-item">
                            <div className="feature-result-item-thumb">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="feature-result-item-title">
                                타이틀
                            </div>
                            <div className="feature-result-item-btn">
                                <RightSquareOutlined/>
                            </div>
                        </div>
                        <div className="feature-result-item">
                            <div className="feature-result-item-thumb">
                                <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                            </div>
                            <div className="feature-result-item-title">
                                타이틀
                            </div>
                            <div className="feature-result-item-btn">
                                <RightSquareOutlined/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id={Modal ? "open-modal" : "close-modal"}>
                <div className="preview-modal" onClick={OnModalClose}>
                </div>
                <div className="preview-modal-image">
                    <img id="img-match" src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F24283C3858F778CA2E"/>
                </div>
            </div>
        </div>
    );
}

export default FindFeaturePage;