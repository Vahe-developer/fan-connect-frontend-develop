import {
    SAVE_USER_DATA,
    REMOVE_APP_CONNECTION,
    SET_PROFILE,
    REMOVE_PAYPAL_CONNECTION,
    ADD_PAYPAL_CONNECTION,
    INACTIVE,
    ACTIVATED,
    TOGGLE_POLL,
} from '../actions/types'

import {Types} from '@myfan/commons'

const apps = [{
    id           : 0,
    name         : '',
    desc         : '',
    title        : '',
    login_uri    : '',
    redirect_uri : '',
    permissionSet: false,
}]

const players = [{
    id      : 0,
    title   : '',
    selected: false,
}]

const userData = {
    gender           : '',
    firstName        : '',
    lastName         : '',
    birthday         : '',
    email            : '',
    phone            : '',
    company          : '',
    street           : '',
    housenumber      : '',
    city             : '',
    zip              : '',
    additionalAddress: '',
    country          : '',
    playerID         : '',
    payment          : {},
    membership       : {
        address    : {
            city       : '',
            country    : '',
            firstName  : '',
            gender     : '',
            lastName   : '',
            middleName : '',
            postalCode : '',
            street     : '',
            houseNumber: '',
            birthDate  : '',
        },
        options    : {
            membershipType: '',
            sportType     : '',
        },
        payment    : {
            payerName: '',
            iban     : '',
        },
        confirmedAt: '',
        nextPayment: '',
        number     : '',
        price      : '',
        status     : 'missing',
    },
}

export const profileState: Types.Profile.ProfileT = {
    reset             : false,
    disabled          : true,
    loading           : true,
    requiredFields    : [],
    apps              : apps,
    players           : players,
    prevState         : userData,
    userData          : userData,
    polls             : [],
    diffFieldsNames   : [],
    mergingProfileData: {},
    validation        : {
        firstName: 'string',
        lastName : 'string',
        birthday : 'date',
        phone    : 'phone',
    },
}


export default (state: any = profileState, action: Types.ActionT) => {
    switch (action.type) {
        case SET_PROFILE:
            return {
                ...state,
                ...action.payload,
            }
        case SAVE_USER_DATA:
            return {
                ...state,
                ...action.payload,
            }
        case REMOVE_APP_CONNECTION:
            return {
                ...state,
                apps: state.apps.map((app: Types.Profile.IApp) => app.id === action.payload.id ? {
                    ...app,
                    permissionSet: false,
                } : app),
            }
        case REMOVE_PAYPAL_CONNECTION:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    payment: {...state.userData.payment, paypal: {...state.userData.payment.paypal, status: INACTIVE}},
                },
            }
        case ADD_PAYPAL_CONNECTION:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    payment: {...state.userData.payment, paypal: {...state.userData.payment.paypal, status: ACTIVATED}},
                },
            }
        case TOGGLE_POLL:
            return {
                ...state,
                polls: state.polls.map((poll: Types.Profile.TPolls) => poll.name === action.payload.name ? {
                    ...poll,
                    selected: action.payload.id,
                } : poll),

            }
        default:
            return state
    }
};
