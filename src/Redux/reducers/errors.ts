import {CLEAR_ERRORS, REMOVE_ERROR, SET_ERRORS} from '../actions/types'
import {ActionT}                                from 'Redux/types/commons'

export const initilaErrState = {}

export default (state: any = initilaErrState, action: ActionT) => {
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                ...action.payload,
            }
        case REMOVE_ERROR:
            const {[action.payload.name]: omit, ...withoutFirst} = state
            return withoutFirst
        case CLEAR_ERRORS:
            for (let member in state) delete state[member]
            return state
        default:
            return state
    }
}
