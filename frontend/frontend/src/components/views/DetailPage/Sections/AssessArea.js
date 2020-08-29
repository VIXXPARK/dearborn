import React, { useState } from 'react';
import {Rate, Button} from 'antd'
import Axios from 'axios';

function AssessArea(props) {

    const [One, setOne] = useState(3)
    const [Two, setTwo] = useState(3)
    const [Three, setThree] = useState(3)
    const [Four, setFour] = useState(3)
    const [Five, setFive] = useState(3)

    const ChangeRate1 = (value) => {
        setOne(value)
    }
    const ChangeRate2 = (value) => {
        setTwo(value)
    }
    const ChangeRate3 = (value) => {
        setThree(value)
    }
    const ChangeRate4 = (value) => {
        setFour(value)
    }
    const ChangeRate5 = (value) => {
        setFive(value)
    }

    const SubmitRate = () => {
        const DatasToSubmit = {
            user : props.userId,
            post : props.postId,
            aesthetics : One,
            originality : Two,
            convienience : Three,
            massProductionPossibility : Four,
            popularity : Five,
        }
        console.log(DatasToSubmit)
        Axios.post('/api/assess/saveValue', DatasToSubmit)
        .then(response => {
            if(response.data.success)
            {
                alert('성공')
                props.updateAssessValue({
                    aesthetics : One,
                    originality : Two,
                    convienience : Three,
                    massProductionPossibility : Four,
                    popularity : Five,
                })
            }else{
                alert('실패')
            }
        })
    }

    return (
        <div>
            <label>심미성</label>

            <Rate style={{background:'black'}} allowHalf defaultValue={3} onChange={ChangeRate1}/><br/>
            <label>독창성</label>
            <Rate style={{background:'red'}} allowHalf defaultValue={3} onChange={ChangeRate2}/><br/>
            <label>편리성</label>
            <Rate style={{background:'tomato'}} allowHalf defaultValue={3} onChange={ChangeRate3}/><br/>
            <label>양산가능성</label>
            <Rate style={{background:'powderblue'}} allowHalf defaultValue={3} onChange={ChangeRate4}/><br/>
            <label>대중성</label>
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