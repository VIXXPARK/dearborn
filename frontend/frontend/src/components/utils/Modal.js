import React from 'react';
import { createPortal } from 'react-dom';

const modalStyle = {
    position: "fixed",
    top: 0,
    left:'5%',
    right:'5%',
    backgroundColor: "white",
    color: "#FFF",
    fontSize: "40px",
  };

function Modal(props) {
    return createPortal(
        <div style={{position:'fixed', top:0, bottom:0, left:0, right:0, backgroundColor:'gray', opacity:'70%'}} onClick={props.onClick}>
            <div style={modalStyle}>
                {props.children}
            </div>
        </div>,
    document.getElementById("modal_root")
    );
}

export default Modal;