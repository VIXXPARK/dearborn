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
                }else{
                    if(adminRoute && ! response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(!option)
                            props.history.push('/')
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent {...props} user={user}/>
        )
    }
    return AuthenticationCheck
}