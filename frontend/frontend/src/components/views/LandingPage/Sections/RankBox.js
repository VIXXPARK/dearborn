import React, { useState, useEffect } from 'react';

import { List, Skeleton, Button, Avatar } from 'antd';

function RankBox(props) {
    const [list, setlist] = useState([])
    const [InitLoading, setInitLoading] = useState(true)
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        
    }, [])

    const onLoadMore = () => {
        setLoading(false)
    }

    const loadMore = InitLoading && !Loading ? (
        <div
            style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight:'32px',
            }}
            >
                <Button onClick={onLoadMore}>Load More</Button>
            </div>) : null

        return (
            <List
                className="loadmore-list"
                loading={InitLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                renderItem={item => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta 
                                avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                                }
                                title={<a href="/">{item.name.last}</a>}
                                description="description"
                            />
                        </Skeleton>
                    </List.Item>
                )}
            >
            </List>
        )
}

export default RankBox;