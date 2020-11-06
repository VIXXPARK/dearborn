import React from 'react'
import ReactLoading from 'react-loading'

export const Loader = (type, color) => {
    return (
        <div className="contentWrap">
            <div style={{
                position:'fixed',
                backgroundColor:"rgba(0,0,0,0.1)",
                width:'100%',
                height:'100%',
                top:0,
                left:0,
            }}></div>
            <div style={{
                position:"fixed",
                width:'50px',
                height:'50px',
                top:"50%",
                left:"50%",
                transform : "translate(-50%, -50%)",
                zIndex : "500",
            }}>
                <ReactLoading
                    type={type}
                    color={color}
                    height={'80%'}
                    width={'80%'}
                />
            </div>
        </div>
    )
}