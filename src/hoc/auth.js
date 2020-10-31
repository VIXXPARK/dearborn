import React, {useEffect} from 'react'
import {auth} from '../_actions/user_action'
import {useSelector, useDispatch} from 'react-redux'

export default function (SpecificComponent, option, adminRoute = null){
    function AuthenticationCheck(props){
        let user = useSelector(state => state.user)
        const dispatch = useDispatch()
        useEffect(() => {
            dispatch(auth()).then(response => {
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                }
            })
        }, [dispatch, props.history])


        return (
            <SpecificComponent {...props} user={user}/>
        )
    }
    return AuthenticationCheck
}