import React from 'react';

function Footer(props) {
    return (
        <div style={{
            height:'80px', display:'flex',
            flexDirection:'column', alignItems : 'center', 
            fontSize:'1rem', borderTop:'2px solid gray',
            margin: '0px 4rem'
        }}>
            <p style={{fontSize:'2rem', fontWeight:'bold'}}>DEarborn!!</p>
        </div>
    );
}

export default Footer;