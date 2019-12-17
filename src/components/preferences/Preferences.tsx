import React, {useEffect}                    from 'react'
import {RouteComponentProps, withRouter}     from 'react-router-dom'
import ChannelContainer, {IChannel}          from './Channels'
import {User, request}                       from '@myfan/base'
import Header                                from './presentation/Header'
import {url, Types as CommonTypes}           from '@myfan/commons'
import {LoadOrFallback, Container}           from '@myfan/web-components'
import {withStore, useDispatch, withContext} from '@myfan/store'
import {actions, Types}                      from 'Redux'

function Preferences(props: RouteComponentProps & { intl: CommonTypes.IntlShape, club: Types.Channels.IClub }) {

    const {intl: {formatMessage: intl}, club} = props
    const dispatch                            = useDispatch()

    useEffect(() => {

        const merge = url.getParam('merge')
        const from  = url.getParam('from')

        if (merge) {
            const successMsg = intl({id: `${from}.merge.confirm.success.message`})
            const failerMsg  = intl({id: `${from}.merge.confirm.failure.message`})

            if (merge === '1') {
                dispatch(actions.notification.set({msg: successMsg, color: 'success'}))
            } else {
                dispatch(actions.notification.set({msg: failerMsg, color: 'danger'}))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!club.loading) return
        // @ts-ignore
        const {hash} = props.match.params

        if (!User.hasValidSession() && !hash) {
            actions.subscriptions.getDefaultSubs(dispatch)
            return
        }

        actions.subscriptions.getPreferences({hash: hash}, dispatch)
            .catch(() => {

                dispatch(
                    actions.subscriptions.setClubSubscriptions({
                        loading  : false,
                        subsFound: false,
                    }),
                )
            })
            .finally(() => {

                if (hash) {

                    url.addParam('hash', hash)

                    if (User.hasValidSession() && User.email !== club.userEmail) {
                        User.logout()
                        dispatch(
                            actions.auth.set({
                                isAuthenticated: false,
                                error          : null,
                            }))
                    }
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getDataToSave = () => {
        return club.channels.map((channel: IChannel) => {
            const defFreq   = channel.frequencies[0]
            const frequency = channel.frequencies.find(frequency => frequency.selected)
            const freqID    = frequency ? frequency.id : defFreq ? defFreq.id : null
            const chan      = channel.topics.filter(topic => topic.selected)
            return {
                id       : channel.id,
                frequency: freqID,
                topics   : chan ? chan.map(topic => topic.id) : [],
            }
        })
    }

    const handleSubmit = (): void => {
        const data = {
            subscriptions: {
                channels: getDataToSave(),
            },
        }
        // @ts-ignore
        const hash = props.match.params.hash ? '/' + props.match.params.hash : ''

        request.post('/preferences/subscriptions' + hash, data)
            .then(() => {
                dispatch(actions.notification.set({
                        msg  : intl({id: 'subscriptions.saved'}),
                        color: 'success',
                    }),
                )
                actions.subscriptions.savePrevState({
                    dispatch,
                    channels: club.channels,
                })
            })
            .catch(() => dispatch(actions.notification.set({
                    msg  : intl({id: 'error.when.saving.preferences'}),
                    color: 'danger',
                }),
            ))
    }

    const errorMessage = () => (
        <p
            style={{textAlign: 'center', fontSize: '20px'}}
        >
            {intl({id: 'subs.not.found'})}
        </p>
    )

    return (
        <Container>
            <Header intl={intl}/>
            <LoadOrFallback isLoading={club.loading} err={!club.subsFound} Fallback={errorMessage}>
                <ChannelContainer handleSubmit={handleSubmit}/>
            </LoadOrFallback>
        </Container>
    )
}


export default withRouter(
    withStore(
        withContext(Preferences),
        (state: { club: any; }) => ({club: state.club})))
