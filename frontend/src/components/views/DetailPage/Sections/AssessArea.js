import React, { useState } from 'react';
import {Rate, Button} from 'antd'
import Axios from 'axios';

function AssessArea(props) {

    const [Design, setDesign] = useState(3)
    const [Color, setColor] = useState(3)
    const [Individuality, setIndividuality] = useState(3)
    const [Practicality, setPracticality] = useState(3)
    const [Trend, setTrend] = useState(3)

    const ChangeRate1 = (value) => {
        setDesign(value)
    }
    const ChangeRate2 = (value) => {
        setColor(value)
    }
    const ChangeRate3 = (value) => {
        setIndividuality(value)
    }
    const ChangeRate4 = (value) => {
        setPracticality(value)
    }
    const ChangeRate5 = (value) => {
        setTrend(value)
    }

    const SubmitRate = () => {
        const DatasToSubmit = {
            user : props.userId,
            post : props.postId,
            design : Design,
            color : Color,
            individuality : Individuality,
            practicality : Practicality,
            trend : Trend,
        }
        console.log(DatasToSubmit)
        Axios.post('/api/assess/saveValue', DatasToSubmit)
        .then(response => {
            if(response.data.success)
            {
                alert('성공')
                props.updateAssessValue({
                    design : Design,
                    color : Color,
                    individuality : Individuality,
                    practicality : Practicality,
                    trend : Trend,
                })
            }else{
                alert('실패')
            }
        })
    }

    return (
        <div>
            <label>디자인이 맘에 드나요?</label>
            <Rate style={{background:'black'}} allowHalf defaultValue={3} onChange={ChangeRate1}/><br/>
            <label>색상이 맘에 드나요?</label>
            <Rate style={{background:'red'}} allowHalf defaultValue={3} onChange={ChangeRate2}/><br/>
            <label>개성있어 보이나요?</label>
            <Rate style={{background:'tomato'}} allowHalf defaultValue={3} onChange={ChangeRate3}/><br/>
            <label>실용성 있어 보이나요?</label>
            <Rate style={{background:'powderblue'}} allowHalf defaultValue={3} onChange={ChangeRate4}/><br/>
            <label>최신 트렌드에 적합한가요?</label>
            <Rate style={{background:'gray'}} allowHalf defaultValue={3} onChange={ChangeRate5}/><br/>
            <br/>
            <Button onClick={SubmitRate}>
                제출
            </Button>
            <br/>
        </div>
    );
}

export default AssessArea;