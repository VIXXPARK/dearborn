import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios'
import { Button } from 'antd';
import {getCookieValue} from '../../../utils/Cookie'

function AssessShow(props) {

    const [ChartSeries, setChartSeries] = useState([])

    useEffect(() => {
        if(props.postId){
            const config = {
                headers : {
                    Authorization: `Token ${getCookieValue('w_auth')}`
                }
            }
        axios.post('/api/assess/getValue', {post : props.postId}, config)
        .then(response => {
            console.log(response)
            if(response.data.success){
                
                setChartSeries([{
                    data : 
                    [
                        response.data.design,
                        response.data.color,
                        response.data.individuality,
                        response.data.practicality,
                        response.data.trend,
                    ]
                }])
            }else{
                setChartSeries([{
                    data : 
                    [ 0, 0, 0, 0, 0 ]
                }])
                console.log(response.data.err)
            }
        })}
    }, [props.assessValue, props.postId])
    const ChartOptions ={
        chart : {
            type : 'radar',
            toolbar : {
                show : false,
            }
        },
        title : {
            text : '평가'
        },
        xaxis : {
            name: "Radar Series 1",
            categories : ['심미성', '독창성','편리성','양산가능성','대중성'],
        },
    }

    return (
        <div>
            <Chart
                options={ChartOptions} 
                series={ChartSeries}
                type='radar'
                width='100%'/>
        </div>
    );
}

export default AssessShow;