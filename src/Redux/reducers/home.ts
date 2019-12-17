import {SET_HOME_DATA} from '../actions/types'
import {ActionT}       from 'Redux/types/commons'

export const HomeSate = {
    user          : {},
    apps          : [],
    appsCategories: [],
    channels      : [],
    membership    : [],
    loading       : true,
}

export default (state: any = HomeSate, action: ActionT) => {
    switch (action.type) {
        case SET_HOME_DATA:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
};
