import {BACK_BUTTON_RESET, PUSH_TO_BACK_BUTTON_STACK} from './types'

export const push = (payload: () => void) => {
    return {
        type: PUSH_TO_BACK_BUTTON_STACK,
        payload
    }
}

export const reset = () => {
    return {
        type: BACK_BUTTON_RESET,
    }
}
