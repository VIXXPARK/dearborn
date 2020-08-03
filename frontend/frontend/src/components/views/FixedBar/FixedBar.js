import React from 'react';

import './Sections/FixedBar.css'

function FixedBar(props) {
    return (
        <div className="fixed">
            <a href="/">
                <div id="fixed-vote">
                    투표 페이지
                </div>
            </a>
            <a href="/repo">
                <div id="fixed-repo">
                    저장소 페이지
                </div>
            </a>
        </div>
    );
}

export default FixedBar;