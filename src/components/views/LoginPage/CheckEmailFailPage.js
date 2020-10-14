import React from 'react';
import {useForm, Controller} from 'react-hook-form'
import { Input, Form , Typography, Button } from 'antd';

const { Title } =Typography;

function CheckEmailFailPage(props) {
    return (
        <div>
            <div className="auth">
                <div className="auth-wrapper">
                    <Title level={2}><a href="/">DEarborn</a></Title>
                    <section style={{backgroundColor:'white', padding:'25px', borderRadius:'7px'}}>
                        <h2>이메일 인증에 <tr/>실패했습니다</h2>
                        <Button><a href="/checkEmail">다시 인증</a></Button>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default CheckEmailFailPage;