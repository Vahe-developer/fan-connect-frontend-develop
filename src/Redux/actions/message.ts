import {SET_MESSAGE} from './types'

export const set = (payload: any) => {
    return {
        type: SET_MESSAGE,
        payload
    }
}
