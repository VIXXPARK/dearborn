import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios'
import { Button } from 'antd';

function AssessShow(props) {

    const [ChartSeries, setChartSeries] = useState([])

    useEffect(() => {
        axios.post('/api/assess/getValue', {postId : props.postId})
        .then(response => {
            if(response.data.success){
                setChartSeries([{
                    data : 
                    [
                        response.data.one,
                        response.data.two,
                        response.data.three,
                        response.data.four,
                        response.data.five
                    ]
                }])
            }else{
                setChartSeries([{
                    data : 
                    [ 0, 0, 0, 0, 0 ]
                }])
                alert('assess 정보 가져오기 실패')
            }
        })
    }, [props.assessValue])

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