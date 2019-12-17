import {withRepositories} from '@myfan/pages'
import {
    ADD_PAYPAL_CONNECTION,
    REMOVE_APP_CONNECTION,
    REMOVE_PAYPAL_CONNECTION,
    SAVE_USER_DATA,
    SET_PROFILE,
    TOGGLE_POLL,
}                         from './types'
import {Types}            from '@myfan/commons'
import {DispatchT}        from 'Redux/types/commons'
import {UserDataT}        from 'Redux/types/profile'

export const setProfileData = (payload: any) => {
    return {
        type: SET_PROFILE,
        payload,
    }
}

export const setUserData = (payload: { prevState: UserDataT, disabled: boolean }) => {
    return {
        type: SAVE_USER_DATA,
        payload,
    }
}

export const removeAppConn = (payload: { id: number }) => {
    return {
        type: REMOVE_APP_CONNECTION,
        payload,
    }
}

export const removePaypalConnection = () => {
    return {
        type: REMOVE_PAYPAL_CONNECTION,
    }
}

export const addPaypalConnection = () => {
    return {
        type: ADD_PAYPAL_CONNECTION,
    }
}

export const setPoll = (payload: { id: number, name: string }) => {
    return {
        type: TOGGLE_POLL,
        payload,
    }
}

type getProfileDataT = {
    dispatch: DispatchT,
    profile: Types.Repository<Types.Profile.ProfileT>,
    membership: Types.Repository<Types.Profile.MembershipT>
}

export const getProfileData = withRepositories(async ({dispatch, profile, membership}: getProfileDataT): Promise<void> => {

        const [resolvedProfie, resolvedMembership] = await Promise.all([profile.getData(), membership.getData()])

        resolvedProfie.userData.membership = resolvedMembership

        dispatch(setProfileData(resolvedProfie))
    },
    (repos: { profile: any; channels: any, membership: any }) => ({
        profile   : repos.profile,
        membership: repos.membership,
    }),
)

type saveUserDataT = {
    userData: UserDataT,
    dispatch: DispatchT,
    profile: Types.Repository<Types.Profile.ProfileT, UserDataT>
}

export const saveUserData = withRepositories(async ({userData, dispatch, profile}: saveUserDataT): Promise<void> => {

        await profile.saveData(userData)

        dispatch(
            setUserData({
                prevState: userData,
                disabled : true,
            }),
        )

    }, (repos: { profile: any }) => ({
        profile: repos.profile,
    }),
)

export const removeAppConnection = (id: number, dispatch: DispatchT): void => {

    dispatch(removeAppConn({id}))
}

export const togglePoll = (id: number, name: string, dispatch: DispatchT): void => {

    dispatch(setPoll({id, name}))
}
