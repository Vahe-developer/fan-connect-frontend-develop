import {request} from '@myfan/base'
import {
    SET_CLUB_SUBSCRIPTIONS,
    SET_SELECTED_CHANNEL,
    SET_SELECTED_FREQUENCY,
    TOGGLE_TOPIC,
    SET_PREFERENCES_PREV_STATE,
    SET_CHANNELS_STATE,
}                from './types'

import {Club}                                from '@myfan/base'
import {StorageFactory}                      from '@myfan/commons'
import {DispatchT}                           from 'Redux/types/commons'
import {IClub, IChannel, ITopic, IFrequency} from 'Redux/types/channels'

export const setClubSubscriptions = (payload: { [key: string]: any }) => {
    return {
        type: SET_CLUB_SUBSCRIPTIONS,
        payload,
    }
}

export const setSelectedChannel = (payload: IChannel[]) => {
    return {
        type: SET_SELECTED_CHANNEL,
        payload,
    }
}

export const setSelectedFrequency = (payload: IChannel[]) => {
    return {
        type: SET_SELECTED_FREQUENCY,
        payload,
    }
}

export const setChannelsState = (payload: IChannel[]) => {
    return {
        type: SET_CHANNELS_STATE,
        payload,
    }
}

export const setPrevState = (payload: IChannel[]) => {
    return {
        type: SET_PREFERENCES_PREV_STATE,
        payload,
    }
}


export const toggleTopic = (payload: IChannel[]) => {
    return {
        type: TOGGLE_TOPIC,
        payload,
    }
}

export const getPreferences = async ({hash}: { hash: string }, dispatch: DispatchT): Promise<any> => {
    hash = hash ? '/' + hash : ''

    const [clubResponse, subsResponse] = await Promise.all([
        request.get('/preferences'),
        request.get('/preferences/subscriptions' + hash),

    ])

    dispatch(
        setClubSubscriptions(
            prepareSubs(
                clubResponse.data.preferences,
                subsResponse.data.subscriptions,
            ),
        ),
    )
}

export const getDefaultSubs = async (dispatch: DispatchT): Promise<any> => {

    const [preferences, clubPreferences] = await Promise.all([
        request.get('/preferences'),
        request.get('/preferences/subscriptions-defaults'),
    ])

    dispatch(
        setClubSubscriptions(
            prepareSubs(preferences.data.preferences, clubPreferences.data.clubDefPref),
        ),
    )

}

const prepareSubs = (preferences: any, userSubs: any): IClub => {

    const storage = StorageFactory.getStorage()

    userSubs.subscriptionEmail ?
        storage.setItem('subscriptionEmail', userSubs.subscriptionEmail) :
        storage.removeItem('subscriptionEmail')


    const chan = {
        subsFound        : true,
        prevState        : [],
        loading          : false,
        userEmail        : userSubs.userEmail,
        subscriptionEmail: userSubs.subscriptionEmail,
        channels         : preferences.map((channel: IChannel, index: number) => {
            const defaultSubscriptions = userSubs.channels.find((SubChannel: IChannel) => SubChannel.id === channel.id) || {
                disabled: true,
                topics  : [],
            }

            return {
                ...channel,
                disabled   : defaultSubscriptions.disabled,
                selected   : !index && true,
                frequencies: channel.frequencies.map((frequency: IFrequency) => {
                    return {
                        ...frequency,
                        selected:
                            defaultSubscriptions.frequency === frequency.id,
                    }
                }),
                topics     : channel.topics.map((topic: ITopic) => {
                    return {
                        ...topic,
                        selected:
                            defaultSubscriptions.topics.find((userTopic: any) => userTopic === topic.id) !== undefined,
                    }
                }),
            }
        }),
    }

    const cookie: IChannel = {
        id         : 0,
        icon       : 'fas fa-cookie-bite icon fa-fw',
        disabled   : false,
        selected   : false,
        name       : 'Cookies',
        frequencies: [],
        topics     : [],
    }

    chan.channels.push(cookie)

    chan.channels = chan.channels.filter((chan: IChannel) => Club.channels.indexOf(chan.name) > -1)

    // @ts-ignore
    chan.prevState = [...chan.channels]

    return chan
}

export const getSelectedChannel = ({channels, selectedChannelID}: { channels: IChannel[], selectedChannelID: number }, dispatch: DispatchT) => {
    const selectedChannel = channels.map(channel => {
        return {...channel, selected: channel.id === selectedChannelID}
    })
    dispatch(setSelectedChannel(selectedChannel))
}

export const getSelectedFrequency = ({channels, frequencyID}: { channels: IChannel[], frequencyID: number }, dispatch: DispatchT): void => {
    const selectedFrequency = channels.map(channel => {
        return {
            ...channel,
            frequencies: channel.frequencies.map((frequency: IFrequency) => {
                return {
                    ...frequency,
                    selected: channel.selected ? frequency.id === frequencyID : frequency.selected,
                }
            }),
        }
    })

    dispatch(setSelectedFrequency(selectedFrequency))
}

export const savePrevState = ({channels, dispatch}: { channels: IChannel[], dispatch: DispatchT }): void => {

    dispatch(setPrevState(channels))
}

export const setChannels = ({channels, dispatch}: { channels: IChannel[], dispatch: DispatchT }): void => {

    dispatch(setChannelsState(channels))
}


export const toggleTopics = ({channels, topicID}: { channels: IChannel[], topicID: number }, dispatch: DispatchT) => {
    const unsettedTopic = channels.map(channel => {
        return {
            ...channel,
            topics: channel.topics.map((topic: any) => {
                return {
                    ...topic,
                    selected: topic.id === topicID ? !topic.selected : topic.selected,
                }
            }),
        }
    })

    dispatch(toggleTopic(unsettedTopic))
}
