import {getCookieValue} from './Cookie'

export const config = {
    headers : {
        Authorization: `Token ${getCookieValue('w_auth')}`
    }
}