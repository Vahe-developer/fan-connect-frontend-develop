import {SET_MESSAGE} from '../actions/types'
import {ActionT}     from 'Redux/types/commons'
import {MessageT}    from 'Redux/types/message'

export const messageState: MessageT = {
    msg: '',
}

export default (state: any = messageState, action: ActionT) => {
    if (action.type === SET_MESSAGE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    return state
};
