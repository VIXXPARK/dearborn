import axios from 'axios'

import {
    REGISTER_USER,
    LOGIN_USER,
    AUTH_USER,

} from './types'

import {USER_SERVER} from '../components/Config'

export function registerUser(data){
    const request = axios.post(`${USER_SERVER}/register`, data)
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
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data)

    return{
        type:AUTH_USER,
        payload:request
    }
}