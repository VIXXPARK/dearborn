import React from 'react';

const modalStyle = {
    position: "fixed",
    left: 40,
    top: 40,
    bottom: 40,
    right: 40,
    backgroundColor: "rgba(0,0,0,.2)",
    color: "#FFF",
    fontSize: "40px",
}

function Modal(props) {
    return (
        <div style={modalStyle} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default Modal;