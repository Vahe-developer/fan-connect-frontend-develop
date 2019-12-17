import {CLEAR_ERRORS, REMOVE_ERROR, SET_ERRORS} from './types'
import {Errors}                                 from 'Redux/types/errors'
import {DispatchT}                              from 'Redux/types/commons'

export const setErrorsData = (payload: Errors) => {
    return {
        type: SET_ERRORS,
        payload,
    }
}

export const remove = (payload: Errors) => {
    return {
        type: REMOVE_ERROR,
        payload,
    }
}

export const clear = (payload?: Errors) => {
    return {
        type: CLEAR_ERRORS,
        payload,
    }
}


export const set = (errors: Errors, dispatch: DispatchT) => {

    const withOutIsEmpty = Object.keys(errors).reduce((acc, error) => {
        const {isEmpty, ...rest} = errors[error]

        // @ts-ignore
        acc[error] = rest
        return acc
    }, {})

    dispatch(
        setErrorsData(
            {...withOutIsEmpty},
        ),
    )
}
