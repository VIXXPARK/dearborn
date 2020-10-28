import React, { useEffect, useState } from 'react';

function PostRankBox(props) {
    const [RankIndex, setRankIndex] = useState(0)
    const [RankPosts, setRankPosts] = useState([{
        title:"post1",
        content:"fgdsakljkdjklsdjfldsjfljdsafjdsfjldlskafj;ldsafjdslafjlsadkfjdlskfjdkfjvoidfvodfa",
        thumbnail : "https://www.publicdomainpictures.net/pictures/320000/velka/background-image.png"
    },{
        title:"post1",
        content:"fgdsakljkdjklsdjfldsjfljdsafjdsfjldlskafj;ldsafjdslafjlsadkfjdlskfjdkfjvoidfvodfa",
        thumbnail : "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
    },{
        title:"post1",
        content:"fgdsakljkdjklsdjfldsjfljdsafjdsfjldlskafj;ldsafjdslafjlsadkfjdlskfjdkfjvoidfvodfa",
        thumbnail : "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    }])
    
    useEffect(() => {
        const rankSlider = setInterval(() => {
            if(RankIndex===2){
                setRankIndex(0)
            }else{
                setRankIndex(RankIndex+1)
            }
        }, 6000);
        return () => clearInterval(rankSlider)
    }, [RankIndex])
    
    return (
        <div className="post-rank-container">
            {RankPosts && RankPosts.map(post => (
                <div style={{transition:'transform 1s', transform:`translate(calc(-550px * ${RankIndex}), 0)`}} className="post-rank-item">
                    <div style={{width:'250px', height:'400px', display:'inline-block'}}>
                        <div>
                            <h1 style={{wordBreak:'break-all'}}>{post.title}</h1>
                        </div>
                        <div>
                            <h3 style={{wordBreak:'break-all'}}>{post.content}</h3>
                        </div>
                    </div>
                    <div style={{width:'300px', height:'400px', display:'inline-block'}}>
                        <img style={{width:'100%', height:'100%', borderRadius:'20px'}} src={post.thumbnail}/>
                    </div>
                </div>
            ))
                
            }
        </div>
    );
}

export default PostRankBox;