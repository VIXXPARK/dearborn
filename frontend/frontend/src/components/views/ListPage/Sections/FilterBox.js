import React, { useState } from 'react';
import {Checkbox, Collapse} from 'antd'
import {filterList} from './Datas'

const {Panel} = Collapse

function FilterBox(props) {

    const [Checked, setChecked] = useState(0)

    const handleToggle = (value)=> {
        if(Checked === value)
        {
            setChecked(0)
            props.handleFilters(0)
        }
        else{
            setChecked(value)
            props.handleFilters(value)
        }
    }

    const renderCheckboxLists = (filterList)=> 
        filterList && filterList.map((value, i) =>(
            <React.Fragment key={i}>
                <div style={{display:'inline-block'}}>
                    <Checkbox
                        onChange={()=>handleToggle(value._id)}
                        type="checkbox"
                        checked={Checked === value._id ? true : false}
                    />&nbsp;&nbsp;
                    <span>{value.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </React.Fragment>
        ))
    return (
        <div style={props.open ? null : {display:'none'}}>
            <Collapse bordered={false}>
                <Panel header="의류" key="1">
                    {renderCheckboxLists(filterList[0].categoryList)}
                </Panel>
                <Panel header="악세서리" key="2">
                    {renderCheckboxLists(filterList[1].categoryList)}
                </Panel>
                <Panel header="신발" key="3">
                    {renderCheckboxLists(filterList[2].categoryList)}
                </Panel>
            </Collapse>
        </div>
    );
}

export default FilterBox;