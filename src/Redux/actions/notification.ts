import {SET_NOTIFICATION} from './types'
import {Types}            from '@myfan/commons'

export const set = (payload: Partial<Types.NotificationT>) => {
    return {
        type: SET_NOTIFICATION,
        payload,
    }
}
