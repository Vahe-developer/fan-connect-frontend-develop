import {combineReducers}                     from '@myfan/store'
import {Types as CommonTypes}                from '@myfan/commons'
import home, {HomeSate}                      from './reducers/home'
import notification, {notificationInitState} from './reducers/notification'
import auth, {authinitState}                 from './reducers/auth'
import message, {messageState}               from './reducers/message'
import club, {clubState}                     from './reducers/subscriptions'
import profile, {profileState}               from './reducers/profile'
import errors, {initilaErrState}             from './reducers/errors'
import backButton, {backButtonInitialState}  from './reducers/backButton'
import {Types as PageTypes}                  from '@myfan/pages'
import {AuthT}                               from './types/auth'
import {NotificationT}                       from './types/notification'
import {IClub}                               from './types/channels'
import {ProfileState}                        from './types/profile'
import {Errors}                              from './types/errors'
import {MessageT}                            from './types/message'
import {BackButtonT}                         from './types/backButton'
import * as actions                          from './actions'
import * as Types                            from './types'

export {actions, Types}

export type GlobalState = {
    auth: AuthT,
    notification: NotificationT,
    backButton: BackButtonT,
    club: IClub,
    profile: ProfileState,
    home: PageTypes.Home.HomeT,
    errors: Errors,
    message: MessageT
}

export type GlobalContextT = {
    intl: CommonTypes.IntlShape,
    bugsnag: {
        notify(string: string): void
    },
    isTablet: boolean,
    isMobile: boolean,
    sidebarOpen: boolean,
    showSidebar: boolean,
    layoutLeftSide: number,
    navBarHeight: number,
    toggleSidebar: () => void,
}

export const initialState = {
    auth        : {...authinitState},
    notification: {...notificationInitState},
    club        : {...clubState},
    profile     : {...profileState},
    home        : {...HomeSate},
    errors      : {...initilaErrState},
    message     : {...messageState},
    backButton  : {...backButtonInitialState}
}


export const rootReducers = combineReducers<GlobalState, any>({
    auth,
    notification,
    club,
    profile,
    home,
    errors,
    message,
    backButton
})
