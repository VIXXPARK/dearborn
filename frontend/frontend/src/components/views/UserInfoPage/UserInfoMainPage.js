import React, { useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import Modal from 'antd/lib/modal/Modal';
import {getCookieValue} from '../../utils/Cookie'

function UserInfoMainPage(props) {

    const [ModalVisible, setModalVisible] = useState(false)

    const DeleteUserHandler = () => {
        setModalVisible(true)
    }
    const handleCancel = (e) => {
        setModalVisible(false)
    }

    const handleOK = (e) => {
        const config = {
            headers : {
                Authorization: `Token ${getCookieValue('w_auth')}`
            }
        }
        axios.get('/api/user/delete', config)
        .then(response =>{
            if(response.data.success){
                setModalVisible(false)
                alert('삭제되었습니다.')
                props.history.push('/')
            }else{
                alert('삭제 실패')
            }
        })
    }
    return (
        <div>
            <a href="/modify/settings"><Button>회원정보 수정</Button></a>
            <a onClick={DeleteUserHandler}><Button danger>회원 탈퇴</Button></a>
            <Modal
                title="경고"
                visible={ModalVisible}
                onOk={handleOK}
                onCancel={handleCancel}
            >
                정말로 삭제하시겠습니까?
            </Modal>
        </div>
    );
}

export default UserInfoMainPage;