import {request}          from '@myfan/base'
import {withRepositories} from '@myfan/pages'
import {SET_HOME_DATA}    from './types'
import {HomeDataT}        from 'Redux/types/home'

export const setData = (payload: any) => {
    return {
        type: SET_HOME_DATA,
        payload,
    }
}

export const getHomeData = withRepositories(async ({profile, channels, membership, dispatch}: HomeDataT) => {
        const [
                  resolvedProfile,
                  resolvedChannels,
                  resolvedMembership,
                  appCategory,
              ] = await Promise.all([
            profile.getData(),
            channels.getData(),
            membership.getData(),
            request.get('/v2/app-category').then(res => res.data),
        ])

        dispatch(setData({
            user          : resolvedProfile.userData,
            apps          : resolvedProfile.apps,
            appsCategories: appCategory,
            channels      : resolvedChannels,
            membership    : resolvedMembership,
            loading       : false,
        }))

    },
    (repos: { profile: any; channels: any, membership: any }) => ({
        profile   : repos.profile,
        channels  : repos.channels,
        membership: repos.membership,
    }),
)
