import {SET_AUTH} from '../actions/types'
import {User}     from '@myfan/base'
import {ActionT}  from 'Redux/types/commons'
import {AuthT}    from 'Redux/types/auth'


export const authinitState: AuthT = {
    isAuthenticated: User.hasValidSession(),
    error          : null,
}

export default (state: any = authinitState, action: ActionT) => {
    switch (action.type) {
        case SET_AUTH:
            console.log('reducer', state, action)
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
};
