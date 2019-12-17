import {
    SET_CLUB_SUBSCRIPTIONS,
    SET_SELECTED_CHANNEL,
    SET_SELECTED_FREQUENCY,
    TOGGLE_TOPIC,
    SET_PREFERENCES_PREV_STATE,
    SET_CHANNELS_STATE,
}                from '../actions/types'
import {ActionT} from 'Redux/types/commons'
import {IClub}   from 'Redux/types/channels'

export const clubState: IClub = {
    userEmail: '',
    channels : [],
    loading  : true,
    prevState: [],
    subsFound: true,
}

export default (state: any = clubState, action: ActionT) => {
    switch (action.type) {
        case SET_CLUB_SUBSCRIPTIONS:
            return {
                ...state,
                ...action.payload,
            }
        case SET_SELECTED_CHANNEL:
            return {
                ...state,
                channels: action.payload,
            }
        case SET_SELECTED_FREQUENCY:
            return {
                ...state,
                channels: action.payload,
            }
        case TOGGLE_TOPIC:
            return {
                ...state,
                channels: action.payload,
            }
        case SET_PREFERENCES_PREV_STATE:
            return {
                ...state,
                prevState: action.payload,
            }
        case SET_CHANNELS_STATE:
            return {
                ...state,
                channels : action.payload,
                prevState: action.payload,
            }
        default:
            return state
    }
};
