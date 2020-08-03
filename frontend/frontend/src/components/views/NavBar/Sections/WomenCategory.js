import React from 'react';

function WomenCategory(props) {
    return (
        <div className="menu-show">
            <ul>
                <li><a href="/">상의</a></li>
                <li><a href="/">하의</a></li>
                <li><a href="/">아우터</a></li>
                <li><a href="/">원피스</a></li>
            </ul>
            <ul>
                <li><a href="/">가방</a></li>
                <li><a href="/">신발</a></li>
                <li><a href="/">모자</a></li>
                <li><a href="/">스포츠</a></li>
            </ul>
            <ul>
                <li><a href="/">양말</a></li>
                <li><a href="/">속옷</a></li>
                <li><a href="/">ETC</a></li>
            </ul>
        </div>
    );
}

export default WomenCategory;