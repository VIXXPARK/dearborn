import axios from 'axios'
import {getCookieValue} from '../components/utils/Cookie'

import {
    REGISTER_USER,
    LOGIN_USER,
    AUTH_USER,
    LOGOUT_USER,
    
} from './types'

import {USER_SERVER} from '../components/Config'

export function registerUser(data){
    const config = {
        header : {'Content-Type' : 'multipart/form-data'}
    }
    const request = axios.post(`${USER_SERVER}/register`, data, config)
    .then(response => response.data)

    return {
        type:REGISTER_USER,
        payload : request
    }
}

export function loginUser(data){
    const request = axios.post(`${USER_SERVER}/login`, data)
        .then(response => response.data)

    return {
        type:LOGIN_USER,
        payload : request
    }
}

export function auth(){
    const config = {
        headers : {
            Authorization: `Token ${getCookieValue('w_auth')}`
        }
    }
    const request = axios.get(`${USER_SERVER}/auth`, config)
        .then(response => response.data)
            

    return{
        type:AUTH_USER,
        payload:request
    }
}

export function logoutUser(){
    const config = {
        headers : {
            Authorization: `Token ${getCookieValue('w_auth')}`
        }
    }
    const request = axios.get(`${USER_SERVER}/logout`, config)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}