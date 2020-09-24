import {Button, Input, Typography, Upload } from 'antd';
import React, { useState } from 'react';

import {UploadOutlined} from '@ant-design/icons'

const {Title} = Typography;

function ContestManagePage(props) {

    const [EventImg, setEventImg] = useState("")
    const [ImgPreview, setImgPreview] = useState("")

    const [OpenModal, setOpenModal] = useState(false)
    const [EventTitle, setEventTitle] = useState("")
    const [EventDesc, setEventDesc] = useState("")

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    const EventImgChange = async ({file}) => {
        if(!file.preview){
            file.preview = await getBase64(file.originFileObj)
        }
        setEventImg(file.originFileObj)
        setImgPreview(file.preview)
    }

    const OnOpenEvent = () => {
        setOpenModal(true)
    }

    const OnCloseEvent = () =>{
        setEventTitle("")
        setEventDesc("")
        setEventImg(null)
        setImgPreview(null)
        setOpenModal(false)
    }

    const onEventTitleChange = (e) =>{
        setEventTitle(e.currentTarget.value)
    }

    const onEventDescChange = (e) =>{
        setEventDesc(e.currentTarget.value)
    }

    const OnHoldEvent= () =>{
        const variable = {
            title : EventTitle,
            description : EventDesc,
            image : EventImg
        }

        console.log(variable)
        setEventTitle("")
        setEventDesc("")
        setEventImg(null)
        setImgPreview(null)
        setOpenModal(false)
    }

    return (
        <>
        <div className="repo-container">
            <div className="contest-left-container">
                <label className="contest-list-label">포스트 목록</label><br/><br/>
                <div className="contest-list-container">
                    <div className="contest-list-item">
                        <img className="contest-list-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-item">
                        <img className="contest-list-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-item">
                        <img className="contest-list-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-item">
                        <img className="contest-list-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-item">
                        <img className="contest-list-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                </div>
            </div>
            <div className="contest-right-container">
                <label className="contest-vertical-list-span">맘에 듬</label>
                <div className="contest-vertical-list-container">
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                </div>
                <label className="contest-vertical-list-span">맘에 들지 않음</label>
                <div className="contest-vertical-list-container">
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                    <div className="contest-list-vertical-item">
                        <img className="contest-list-vertical-item-img" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
                    </div>
                </div>
                <div className="contest-list-btn" onClick={OnOpenEvent}>미리보기</div>
                <div className="contest-list-btn" onClick={OnOpenEvent}>콘테스트 수정</div>
            </div>
        </div>
            <div id={OpenModal ? "open-modal" : "close-modal"}>
                <div className="event-modal-background"></div>
                <div className="event-modal-container">
                    <div className="event-modal-wrapper">
                        <Title>이벤트 개최하기</Title>
                        <label style={{fontSize:'28px'}}>제목</label>
                        <Input value={EventTitle} onChange={onEventTitleChange}/>
                        <br/><br/><br/>
                        <label style={{fontSize:'25px'}}>설명</label>
                        <Input.TextArea rows={10} value={EventDesc} onChange={onEventDescChange}/>
                        <br/><br/><br/>
                        <label style={{fontSize:'23px'}}>포스터</label>
                        <br/>
                        <Upload
                            multiple={false}
                            onChange={EventImgChange}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                        {ImgPreview ? <img style={{width:'50px', height:'50px'}} src={ImgPreview}/>:null}
                        <br/><br/>
                        <Button className="event-modal-btn" danger onClick={OnCloseEvent}>취소</Button>
                        <Button style={{color:'powderBlue', borderColor:'powderBlue'}} className="event-modal-btn" onClick={OnHoldEvent}>개최</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContestManagePage;