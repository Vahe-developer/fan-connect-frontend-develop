import React, {useEffect}                          from 'react'
import {Container}                                 from 'reactstrap'
import TopicsContainer                             from './topics/TopicsContainer'
import {url, Global, object, Types as CommonTypes} from '@myfan/commons'
import {Conditional}                               from '@myfan/web-components'
import {RouteComponentProps, withRouter}           from 'react-router-dom'
import ChannelIcons                                from './icons/ChannelIcons'
import './channels.scss'
import {isMobile}                                  from 'react-device-detect'
import {request, User}                             from '@myfan/base'
import ChannelButtons                              from './ChannelButtons'
import {EMAIL, WHATSAPP}                           from '../constants/Channels'
import Usercentrics                                from '../usercentrics/Usercentrics'
import {useDispatch, withStore, withContext}       from '@myfan/store'
import {actions, Types}                            from 'Redux'

export interface IFrequency {
    id: number,
    name: string,
    selected: boolean,
    nameTranslationKey: string
}

export interface ITopic {
    id: number,
    name: string,
    nameTranslationKey: string,
    description: string,
    descTranslationKey: string,
    selected: boolean
}

export interface IChannel {
    id: number,
    icon: string,
    name: string,
    selected: boolean,
    disabled: boolean,
    topics: ITopic[],
    frequencies: IFrequency[]
}

export interface IChannelsContainer {
    history: RouteComponentProps<any>,
    intl: CommonTypes.IntlShape,
    bugsnag: { notify(message: string): void },
    channels: Types.Channels.IChannel[],
    prevState: Types.Channels.IChannel[],

    handleSubmit(): void

}

function ChannelsContainer(props: IChannelsContainer) {

    const {bugsnag, intl: {formatMessage: intl}, channels, prevState} = props
    const dispatch                                                    = useDispatch()

    const sortChannelbySource = (channels: IChannel[]): IChannel[] => {

        let page        = url.getParam('page')
        const utmSource = url.getParam('utm_source')

        if (!page && !utmSource) return channels
        if (!page && utmSource) page = utmSource
        if (page === 'newsletter' || page === 'email') page = EMAIL

        return channels.map(val => {
            return {...val, selected: val.name.toLowerCase() === page.toLowerCase()}
        })
    }

    const sortedChannels = sortChannelbySource(channels)

    const selectedChann = (): IChannel => {
        const selectedChannel = sortedChannels.find(channel => channel.selected)
        if (!selectedChannel) return sortedChannels[0]
        return selectedChannel
    }

    const selectedChannel = selectedChann()
    const hash            = User.getHashwithSlash()

    useEffect(() => {

        if (url.getParam('page') === 'cookies') {
            // @ts-ignore
            Global.window.usercentrics &&
            // @ts-ignore
            Global.window.usercentrics.updateBannerIsVisible &&
            // @ts-ignore
            Global.window.usercentrics.updateBannerIsVisible(false)
        }
    })

    useEffect(() => {

        const channelName = selectedChannel.name.toLowerCase()
        const messageId   = url.getParam('messageID')

        url.addParam('page', channelName)

        if (messageId) {
            dispatch(
                actions.notification.set({
                        msg  : intl({id: messageId}),
                        color: 'success',
                    },
                ))
            url.removeParams(['messageID', 'refresh'])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = (channelID: number): void => {

        const channel     = channels.find(channel => channel.id === channelID) || channels[0]
        const channelName = channel.name.toLowerCase()

        url.addParam('page', channelName)

        actions.subscriptions.getSelectedChannel({
            channels         : channels,
            selectedChannelID: channelID,
        }, dispatch)
    }

    const isChannelDisabled = (): boolean => selectedChannel.disabled


    const unsubscribe = () => {

        if (selectedChannel.name === 'WhatsApp') {
            const newTab = Global.window.open('', '_blank')
            return request.get('/get-wb-widget-data?hash=' + User.hash)
                .then(res => {

                    if (
                        !res.data.numbers ||
                        !res.data.numbers[0]) return bugsnag.notify(`${process.env.REACT_APP_SOURCE ? process.env.REACT_APP_SOURCE : ''} webhook is not working!`)

                    const channelNumber  = res.data.user_channelnumber || res.data.numbers[0]
                    // @ts-ignore
                    newTab.location.href = 'https://' + (isMobile ? 'api' : 'web') + '.whatsapp.com/send?phone=' + channelNumber + '&text=Stop'
                })
        }

        request.post('unsubscribe-nl2go' + hash)
            .then(() => {
                url.addParam('messageID', 'successfully.unsubscribed')
                Global.window.location.reload()
            })
            .catch(() => dispatch(
                actions.notification.set({
                    msg  : intl({id: 'please.try.later'}),
                    color: 'danger',
                }),
            ))
    }

    const channelNameForSignOutBtn = (): string => {
        if (selectedChannel.name === WHATSAPP) return intl({id: 'channel.name.signout.btn.whatsapp'})
        if (selectedChannel.name === EMAIL) return intl({id: 'channel.name.signout.btn.email'})
        return 'SignOut'
    }

    return (
        <Container className={'channels'}>
            <ChannelIcons
                onClick={handleClick}
                channels={sortedChannels}
                selected={selectedChannel}
            />
            {selectedChannel.name === 'Cookies' ? (
                <Usercentrics/>
            ) : (
                <Conditional cond={(User.hash || User.hasValidSession())}>
                    <TopicsContainer
                        disabled={isChannelDisabled()}
                        selectedChannel={selectedChannel}
                    />
                    <ChannelButtons
                        showSaveButton={!object.isEqual(prevState, channels, ['selected'])}
                        unsubscribe={unsubscribe}
                        isChannelDisabled={isChannelDisabled}
                        handleSave={props.handleSubmit}
                        onCancel={() => {
                            actions.subscriptions.setChannels({
                                dispatch,
                                channels: prevState,
                            })
                        }}
                        channel={channelNameForSignOutBtn()}
                    />
                </Conditional>
            )}
        </Container>
    )
}

export default withRouter(
    withContext(
        withStore(
            ChannelsContainer,
            (state: { club: { channels: any; prevState: any } }) => ({
                channels : state.club.channels,
                prevState: state.club.prevState,
            }),
        ),
    ),
)
