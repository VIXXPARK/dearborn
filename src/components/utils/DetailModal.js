import React from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

function DetailModal(props) {
    return createPortal(
        <>
        <div style={{position:'fixed', top:0, bottom:0, left:0, right:0, backgroundColor:'black', opacity:'0.7',zIndex:'500'}} onClick={props.onClick}>
        </div>
        <div className='modal-container' style={{zIndex:'600'}}>
            <div className="modal-content-style">
                {props.children}
            </div>
        </div>
        </>,
    document.getElementById("modal_root")
    );
}

export default DetailModal;