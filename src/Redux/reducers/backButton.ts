import {PUSH_TO_BACK_BUTTON_STACK, BACK_BUTTON_RESET} from '../actions/types'
import {BackButtonT}                                  from '../types/backButton'
import {ActionT}                                      from '../types/commons'
import Stack                                          from 'commons/Stack'

export const backButtonInitialState: BackButtonT = {
    stack : new Stack(),
}

export default (state: any = backButtonInitialState, action: ActionT) => {
    switch (action.type) {
        case PUSH_TO_BACK_BUTTON_STACK:

            state.stack.push(action.payload)

            return {
                ...state,
            }
        case BACK_BUTTON_RESET:

            state.stack.items = []

            return {
                ...state,
            }
        default:
            return state
    }
}