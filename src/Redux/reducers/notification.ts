import {SET_NOTIFICATION} from '../actions/types'
import {Types}            from '@myfan/commons'

export const notificationInitState: Types.NotificationT = {
    msg   : null,
    color : null,
    fadeIn: null,
    show  : false,
}

export default (state: any = notificationInitState, action: Types.ActionT) => {
    switch (action.type) {
        case SET_NOTIFICATION:
            return {
                ...state,
                show: true,
                ...action.payload,
            }
        default:
            return state
    }
};
